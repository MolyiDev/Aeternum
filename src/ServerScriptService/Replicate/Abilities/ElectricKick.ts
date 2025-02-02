// Imports
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from "ReplicatedStorage/Classes/Character";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { ElectricKickInfo } from "ReplicatedStorage/Abilities/Hands/ElectricKick";
import { RagdollManager } from "ServerScriptService/Managers/RagdollManager";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EHitResult } from "ReplicatedStorage/Enums/EHitResult";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

// Variables
const Ability = EAbility.ElectricKick;
const AbilityInfo = ModuleManager.GetAbilityInfo(Ability)!;

@ReplicateInfo(ElectricKickInfo)
export class ElectricKick extends CReplicate {
	public AlreadyLooked: Character[] = [];
	public CharacterList: Character[] = [];
	public Animation: AnimationTrack = this.Animations.GetAnimation(EAnimations.ElectricKick);
	public MarkRockHand: RBXScriptConnection = undefined!;
	public MarkDamage: RBXScriptConnection = undefined!;

	public Destroy() {
		this.Butler.RemoveList(this.MarkRockHand, this.MarkDamage);
		this.CharacterList.clear();
		this.AlreadyLooked.clear();

		this.CharacterList = undefined!;
		this.AlreadyLooked = undefined!;
		this.Animation = undefined!;
		this.MarkRockHand = undefined!;
		this.MarkDamage = undefined!;

		super.Destroy();
	}

	public Fired() {
		if (this.Attributes.IsStunned() || this.Attributes.UsingAbility() || !this.States.IsGrounded()) return;
		this.SetUsingAbility(Ability);

		StunManager.Stun(this.Character, 1, EStunType.Partial);
		this.Animation.Play();
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		this.MarkRockHand = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			if (!this.Attributes.UsingAbility()) {
				if (!this.Attributes.IsStunnedFull()) StunManager.UnStun(this.Character);
				task.delay(0.1, () => animTrack.Stop(EGlobal.Feint));

				return;
			}

			this.CharacterList = [];
			this.AlreadyLooked = [];

			HitboxManager.Create(
				Enum.PartType.Block,
				new Vector3(7, 6, 16),
				this.HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -12)),
				0.2,
				undefined,
				this.OverlapParamsDefault,
				(part: BasePart) => this.Punch(part),
			);

			task.wait(0.2);
			if (this.CharacterList.size() === 0 || this.Attributes.IsStunnedFull()) {
				animTrack.Stop(0.4);
				return;
			}

			StunManager.Stun(this.Character, 4, EStunType.Partial);
		});

		this.MarkDamage = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Damage"), (param) => {
			if (param === "3") {
				this.CharacterList.forEach((character) => {
					character.Animations.GetAnimation(EAnimations.ElectricKickReceive).Stop(0.5);
					DamageManager.Damage(character, 20);
					DamageManager.KnockbackRagdoll(
						character,
						this.HumanoidRootPart.CFrame.LookVector.add(this.HumanoidRootPart.CFrame.UpVector).mul(225),
						1,
						4,
					);
				});
			} else this.CharacterList.forEach((character) => DamageManager.Damage(character, 10));
		});
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		const Cooldown = this.Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		this.Attributes.SetTickAnim(Ability, Cooldown);
		this.SetUsingAbility(undefined);
	}

	public Punch(part: BasePart) {
		const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
		if (!HitCharacter || this.AlreadyLooked.includes(HitCharacter)) return;
		this.AlreadyLooked.push(HitCharacter);

		const [HitResult] = DamageManager.EvaluateHit(HitCharacter, AbilityInfo);

		switch (HitResult) {
			case EHitResult.None:
				break;
			case EHitResult.PerfectBlocked:
			case EHitResult.Blocked:
				DamageManager.Knockback(
					HitCharacter,
					HitCharacter.HumanoidRootPart.CFrame.LookVector.add(
						HitCharacter.HumanoidRootPart.CFrame.UpVector,
					).mul(50),
					0.5,
				);
				return;
			case EHitResult.Dashed:
			case EHitResult.Dodged:
				return;
		}

		this.CharacterList.push(HitCharacter);

		RagdollManager.UnRagdollCharacter(HitCharacter);
		StunManager.Stun(HitCharacter, 5);
		const ReceiveElectricKick = HitCharacter.Animations.GetAnimation(EAnimations.ElectricKickReceive);
		ReceiveElectricKick.Play();
		ReceiveElectricKick.TimePosition = this.Animation.TimePosition;
	}
}
