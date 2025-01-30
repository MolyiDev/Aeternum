// Imports
import { SeriousPunchInfo } from "ReplicatedStorage/Abilities/Hands/SeriousPunch";
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
const Ability = EAbility.SeriousPunch;
const AbilityInfo = ModuleManager.GetAbilityInfo(Ability)!;

@ReplicateInfo(SeriousPunchInfo)
export class SeriousPunch extends CReplicate {
	public PlayersDamaged: Character[] = [];
	public MarkDamage: RBXScriptConnection = undefined!;
	public Animation: AnimationTrack = this.Animations.GetAnimation(EAnimations.SeriousPunch);

	public Fired() {
		if (this.Attributes.IsStunned() || this.Attributes.UsingAbility() || !this.States.IsGrounded()) return;
		this.SetUsingAbility(Ability);

		StunManager.Stun(this.Character, 1.45, EStunType.Partial);
		this.Animation.Play();
	}

	public Destroy() {
		this.Butler.Remove(this.MarkDamage);
		this.PlayersDamaged.clear();

		this.PlayersDamaged = undefined!;
		this.MarkDamage = undefined!;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		this.MarkDamage = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Damage"), () => {
			if (!this.Attributes.UsingAbility()) {
				if (!this.Attributes.IsStunnedFull()) StunManager.UnStun(this.Character);
				animTrack.Stop(EGlobal.Feint);
				return;
			}

			this.PlayersDamaged = [];

			HitboxManager.CreateMultiple(
				new Vector3(10, 5, 10),
				new Vector3(30, 15, 30),
				this.HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -2)),
				4,
				0.065,
				0.5,
				true,
				this.OverlapParamsDefault,
				(part, box) => this.Punch(part, box),
			);
		});
	}

	public AnimStop(animTrack: AnimationTrack) {
		const Cooldown = this.Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		this.Attributes.SetTickAnim(Ability, Cooldown);
		this.SetUsingAbility(undefined);
	}

	public Punch(part: BasePart, box: number) {
		const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
		if (!HitCharacter || this.PlayersDamaged.includes(HitCharacter)) return;
		this.PlayersDamaged.push(HitCharacter);

		const [HitResult, Damage, Velocity] = DamageManager.EvaluateHit(
			HitCharacter,
			AbilityInfo,
			AbilityInfo.Damage[box],
			275 - box * 10,
		);

		switch (HitResult) {
			case EHitResult.None:
				DamageManager.Damage(HitCharacter, Damage);
				DamageManager.KnockbackRagdoll(
					HitCharacter,
					this.HumanoidRootPart.CFrame.LookVector.add(this.HumanoidRootPart.CFrame.UpVector).mul(Velocity),
					1,
					4,
				);
				break;
			case EHitResult.PerfectBlocked:
				DamageManager.Knockback(HitCharacter, this.HumanoidRootPart.CFrame.LookVector.mul(Velocity), 0.5);
				break;
			case EHitResult.Blocked:
				DamageManager.Damage(HitCharacter, Damage);
				DamageManager.Knockback(HitCharacter, this.HumanoidRootPart.CFrame.LookVector.mul(Velocity), 0.5);
				break;
			case EHitResult.Dashed:
			case EHitResult.Dodged:
				return;
		}
	}
}
