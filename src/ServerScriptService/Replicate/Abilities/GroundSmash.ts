// Imports
import { Workspace } from "@rbxts/services";
import { GroundSmashInfo } from "ReplicatedStorage/Abilities/Hands/GroundSmash";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EHitResult } from "ReplicatedStorage/Enums/EHitResult";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

// Variables
const Ability = EAbility.GroundSmash;
const AbilityInfo = ModuleManager.GetAbilityInfo(Ability)!;

@ReplicateInfo(GroundSmashInfo)
export class GroundSmash extends CReplicate {
	public PlayersDamaged: Character[] = [];
	public Height: number = 0;

	public MarkSmash1: RBXScriptConnection = undefined!;
	public MarkSmash2: RBXScriptConnection = undefined!;
	public MarkSmash3: RBXScriptConnection = undefined!;
	public MarkDamage: RBXScriptConnection = undefined!;
	public StateChanged: RBXScriptConnection = undefined!;

	private GroundSmashIdle: AnimationTrack;
	private GroundSmashLand: AnimationTrack;
	private GroundSmash: AnimationTrack;

	constructor(character: Character) {
		super(character);

		this.GroundSmashIdle = this.Animations.GetAnimation(EAnimations.GroundSmashIdle);
		this.GroundSmashLand = this.Animations.GetAnimation(EAnimations.GroundSmashLand);
		this.GroundSmash = this.Animations.GetAnimation(EAnimations.GroundSmash);
	}

	public Destroy() {
		this.Character.Butler.RemoveList(
			this.MarkSmash1,
			this.MarkSmash2,
			this.MarkSmash3,
			this.MarkDamage,
			this.StateChanged,
		);
		this.PlayersDamaged.clear();

		this.PlayersDamaged = undefined!;
		this.Height = undefined!;
		this.MarkSmash1 = undefined!;
		this.MarkSmash2 = undefined!;
		this.MarkSmash3 = undefined!;
		this.MarkDamage = undefined!;
		this.StateChanged = undefined!;
		this.GroundSmash = undefined!;
		this.GroundSmashLand = undefined!;
		this.GroundSmash = undefined!;
	}

	public Fired() {
		if (this.Attributes.IsStunned()) return;
		this.SetUsingAbility(Ability);

		if (this.States.IsGrounded()) {
			StunManager.Stun(this.Character, 4.5, EStunType.Partial);
			this.GroundSmash.Play();
		} else {
			this.GroundSmashIdle.Play(0.25);

			this.StateChanged = this.Butler.Connect(this.Humanoid.StateChanged, (oldValue, newValue) => {
				if (newValue !== Enum.HumanoidStateType.Landed) return;
				this.Land();
			});

			const rayOrigin = this.HumanoidRootPart.Position;

			const rayResult = Workspace.Raycast(rayOrigin, new Vector3(0, -5000, 0), this.RayParamsDefault);
			if (!rayResult) {
				this.Height = 0;
				return;
			}

			this.Height = rayOrigin.sub(rayResult.Position).Magnitude;
		}
	}

	public Land() {
		StunManager.Stun(this.Character, 0.75, EStunType.Partial);
		this.GroundSmashIdle.Stop();
		this.GroundSmashLand.Play();
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string) {
		switch (animName) {
			case EAnimations.GroundSmash:
				this.MarkSmash1 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash1"), () => {
					if (!this.Attributes.UsingAbility()) {
						if (!this.Attributes.IsStunnedFull()) StunManager.UnStun(this.Character);
						animTrack.Stop(EGlobal.Feint);

						return;
					}

					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 12, 12),
						this.HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						undefined,
						this.OverlapParamsDefault,
						(part: BasePart) => this.Punch(part, 0),
					);
				});

				this.MarkSmash2 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash2"), () => {
					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 24, 24),
						this.HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						undefined,
						this.OverlapParamsDefault,
						(part: BasePart) => this.Punch(part, 1),
					);
				});

				this.MarkSmash3 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () => {
					this.PlayersDamaged = [];

					HitboxManager.Create(
						Enum.PartType.Cylinder,
						new Vector3(2, 42, 42),
						this.HumanoidRootPart.CFrame.mul(new CFrame(0, -1, 0)),
						0.2,
						false,
						undefined,
						this.OverlapParamsDefault,
						(part: BasePart) => this.Punch(part, 2),
					);
				});
				break;
			case EAnimations.GroundSmashLand:
				this.GroundSmashIdle.Stop();
				break;
		}
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		if (animName === EAnimations.GroundSmashIdle) {
			this.Butler.Remove(this.StateChanged);
			return;
		}

		const Cooldown = this.Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		this.Attributes.SetTickAnim(Ability, Cooldown);
		this.SetUsingAbility(undefined);
	}

	public Punch(part: BasePart, box: number) {
		const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
		if (!HitCharacter || this.PlayersDamaged.includes(HitCharacter)) return;
		this.PlayersDamaged.push(HitCharacter);
		const Attributes = HitCharacter.Attributes;

		if (Attributes.IsDashing() && AbilityInfo.Dasheable) return;

		let Velocity = 300 + box * 20;

		const [HitResult, Damage] = DamageManager.EvaluateHit(HitCharacter, AbilityInfo, AbilityInfo.Damage[box]);

		switch (HitResult) {
			case EHitResult.None:
				break;
			case EHitResult.Blocked:
			case EHitResult.PerfectBlocked:
				Velocity *= EGlobal.BlockDamageReduce;
				break;
			case EHitResult.Dashed:
			case EHitResult.Dodged:
				return;
		}

		DamageManager.Damage(HitCharacter, Damage);

		const HumanoidRootPart = this.Character.HumanoidRootPart;

		if (HitResult === EHitResult.Blocked || HitResult === EHitResult.PerfectBlocked)
			DamageManager.Knockback(HitCharacter, HumanoidRootPart.CFrame.UpVector.mul(Velocity), 0.45);
		else DamageManager.KnockbackRagdoll(HitCharacter, HumanoidRootPart.CFrame.UpVector.mul(Velocity), 0.45, 3);
	}
}
