// Imports
import { Workspace } from "@rbxts/services";
import { GroundSmashInfo } from "ReplicatedStorage/Abilities/GroundSmash";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

// Variables
const Ability = EAbility.GroundSmash;
const AbilityInfo = ModuleManager.GetAbilityInfo(Ability)!;

@ReplicateInfo(GroundSmashInfo)
export class GroundSmash implements IReplicateClass {
	public Character: Character;
	public OverlapParams: OverlapParams;
	public RayParams: RaycastParams;
	public PlayersDamaged: Character[];
	public MarkSmash: RBXScriptConnection = undefined!;
	public MarkSmash1: RBXScriptConnection = undefined!;
	public MarkSmash2: RBXScriptConnection = undefined!;
	public MarkSmash3: RBXScriptConnection = undefined!;
	public MarkerDamage: RBXScriptConnection = undefined!;
	public Height: number;

	constructor(character: Character) {
		this.Character = character;

		const overlapParams = new OverlapParams();
		overlapParams.FilterDescendantsInstances = [character.Model];
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		this.OverlapParams = overlapParams;

		const rayParams = new RaycastParams();
		rayParams.FilterDescendantsInstances = [character.Model];
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.RayParams = rayParams;

		this.PlayersDamaged = [];
		this.Height = 0;
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string) {
		if (animName !== EAnimations.GroundSmashIdle) return;

		const rayOrigin = this.Character.HumanoidRootPart.Position;

		const rayResult = Workspace.Raycast(rayOrigin, new Vector3(0, -5000, 0), this.RayParams);
		if (!rayResult) {
			this.Height = 0;
			return;
		}

		this.Height = rayOrigin.sub(rayResult.Position).Magnitude;
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Butler = Character.Butler;
		const HumanoidRootPart = Character.HumanoidRootPart;

		const overlapParams = new OverlapParams();
		overlapParams.FilterDescendantsInstances = [Character.Model];
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		switch (animName) {
			case EAnimations.GroundSmash:
				this.MarkSmash1 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash1"), () => {
					if (!Attributes.UsingAbility()) {
						if (!Attributes.IsStunnedFull()) StunManager.UnStun(Character);
						animTrack.Stop(EStopGlobal);
						return;
					}

					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 10, 10),
						HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						overlapParams,
						(part: BasePart) => this.Punch(part, 0),
					);
				});

				this.MarkSmash2 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash2"), () => {
					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 24, 24),
						HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						overlapParams,
						(part: BasePart) => this.Punch(part, 1),
					);
				});

				this.MarkSmash3 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () => {
					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 42, 42),
						HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						overlapParams,
						(part: BasePart) => this.Punch(part, 2),
					);
				});
				break;
			case EAnimations.GroundSmashLand:
				break;
		}
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		if (animName === EAnimations.GroundSmashIdle) return;
		const Attributes = this.Character.Attributes;

		const Cooldown = Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		Attributes.SetTickAnim(Ability, Cooldown);
	}

	public Punch(part: BasePart, box: number) {
		const HitCharacter = CharacterManager.GetCharacter(part.Parent);
		if (!HitCharacter || this.PlayersDamaged.includes(HitCharacter)) return;
		this.PlayersDamaged.push(HitCharacter);
		const Attributes = HitCharacter.Attributes;

		if (Attributes.IsDashing() && AbilityInfo.Dasheable) return;

		let Velocity = 40 + box * 20;

		let Damage = AbilityInfo.Damage[box];

		if (Attributes.IsBlocking()) {
			if (AbilityInfo.Parryable) {
				const TickParry = tick() - Attributes.TickParry();
				if (TickParry <= AbilityInfo.ParryTime) {
					Attributes.SetTickParry(tick());
					StunManager.Stun(this.Character, AbilityInfo.ParryStunTime);
					return;
				}
			}

			if (AbilityInfo.Blockeable) {
				Damage /= AbilityInfo.BlockDamageReduce;
				Velocity /= AbilityInfo.BlockDamageReduce;
			}
		}

		DamageManager.Damage(HitCharacter, Damage);

		const HumanoidRootPart = this.Character.HumanoidRootPart;

		if (Attributes.IsBlocking())
			DamageManager.Knockback(HitCharacter, HumanoidRootPart.CFrame.UpVector.mul(Velocity), 0.5);
		else DamageManager.KnockbackRagdoll(HitCharacter, HumanoidRootPart.CFrame.UpVector.mul(Velocity), 1, 4);
	}

	public Destroy() {
		this.Character.Butler.Remove(this.MarkerDamage);

		this.Character = undefined!;
		this.OverlapParams = undefined!;
		this.PlayersDamaged.clear();
		this.PlayersDamaged = undefined!;
	}
}
