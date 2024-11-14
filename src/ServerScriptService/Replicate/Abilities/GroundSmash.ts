import { Workspace } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAbilityInfo } from "ReplicatedStorage/Enums/Abilities/EAbilityInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

export class GroundSmash implements IReplicateClass {
	public Character: Character;
	public OverlapParams: OverlapParams;
	public RayParams: RaycastParams;
	public PlayersDamaged: Character[];
	public AbilityInfo: IAbilityInfo;
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
		this.AbilityInfo = EAbilityInfo[EAbility.GroundSmash];
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
		const Butler = this.Character.Butler;
		const HumanoidRootPart = this.Character.HumanoidRootPart;

		switch (animName) {
			case EAnimations.GroundSmash:
				break;
			case EAnimations.GroundSmashLand:
				break;
		}
	}

	public AnimStop(animTrack: AnimationTrack, animName: string) {
		if (animName === EAnimations.GroundSmashIdle) return;
		this.Character.Attributes.SetTickAnim(EAbility.GroundSmash, tick());
	}

	public Punch(part: BasePart, box: number) {
		const HitCharacter = CharacterManager.GetCharacter(part.Parent);
		if (!HitCharacter || this.PlayersDamaged.includes(HitCharacter)) return;
		this.PlayersDamaged.push(HitCharacter);
		const Attributes = HitCharacter.Attributes;
		const AbilityInfo = this.AbilityInfo;

		if (Attributes.IsDashing() && AbilityInfo.Dasheable) return;

		let Velocity = 100 - box * 20;

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
			DamageManager.Knockback(HitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 0.5);
		else DamageManager.KnockbackRagdoll(HitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 1, 4);
	}

	public Destroy() {
		this.Character.Butler.Remove(this.MarkerDamage);

		this.Character = undefined!;
		this.OverlapParams = undefined!;
		this.PlayersDamaged.clear();
		this.PlayersDamaged = undefined!;
		this.AbilityInfo = undefined!;
	}
}
