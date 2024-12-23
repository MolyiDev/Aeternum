// Imports
import { HitboxManager } from "ReplicatedStorage/Managers/HitboxManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { ElectricKickInfo } from "ReplicatedStorage/Abilities/Hands/ElectricKick";
import { RagdollManager } from "ServerScriptService/Managers/RagdollManager";

// Variables
const Ability = EAbility.ElectricKick;
const AbilityInfo = ModuleManager.GetAbilityInfo(Ability)!;

@ReplicateInfo(ElectricKickInfo)
export class ElectricKick implements IReplicateClass {
	public Character: Character;
	public AlreadyLooked: Character[];
	public CharacterList: Character[];
	public Animation: AnimationTrack;

	public MarkRockHand: RBXScriptConnection = undefined!;
	public MarkDamage: RBXScriptConnection = undefined!;
	public MarkDamageFinal: RBXScriptConnection = undefined!;
	public MarkStop: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;

		this.AlreadyLooked = [];
		this.CharacterList = [];
		this.Animation = character.Animations.GetAnimation(EAnimations.ElectricKick);
	}

	public Signal() {
		const Character = this.Character;
		const Butler = Character.Butler;
		const Attributes = Character.Attributes;
		const HumanoidRootPart = Character.HumanoidRootPart;

		const ElectricKick = this.Animation;

		const overlapParams = new OverlapParams();
		overlapParams.FilterDescendantsInstances = [Character.Model];
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		StunManager.Stun(Character, 1, EStunType.Partial);
		ElectricKick.Play();

		this.CharacterList = [];
		this.AlreadyLooked = [];

		this.MarkRockHand = Butler.Connect(ElectricKick.GetMarkerReachedSignal("RockHand"), () => {
			if (!Attributes.UsingAbility()) {
				if (!Attributes.IsStunnedFull()) StunManager.UnStun(Character);
				task.delay(0.1, () => ElectricKick.Stop(EStopGlobal));
				return;
			}

			HitboxManager.Create(
				Enum.PartType.Block,
				new Vector3(8, 6, 16),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -12)),
				0.2,
				false,
				overlapParams,
				(part: BasePart) => this.Punch(part),
			);

			task.wait(0.2);
			if (this.CharacterList.size() === 0 || Attributes.IsStunnedFull()) {
				ElectricKick.Stop(0.4);
				return;
			}

			StunManager.Stun(Character, 4, EStunType.Partial);
		});

		this.MarkDamage = Butler.Connect(ElectricKick.GetMarkerReachedSignal("Damage"), () =>
			this.CharacterList.forEach((character) => DamageManager.Damage(character, 10)),
		);

		this.MarkDamageFinal = Butler.Connect(ElectricKick.GetMarkerReachedSignal("DamageFinal"), () => {
			this.CharacterList.forEach((character) => {
				character.Animations.GetAnimation(EAnimations.ReceiveElectricKick).Stop();
				DamageManager.Damage(character, 20);
				DamageManager.KnockbackRagdoll(character, Character.HumanoidRootPart.CFrame.LookVector.mul(100), 1, 5);
			});
		});
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Butler = Character.Butler;

		Butler.RemoveList(this.MarkRockHand, this.MarkDamage, this.MarkDamageFinal, this.MarkStop);

		const Cooldown = Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		Attributes.SetTickAnim(Ability, Cooldown);
	}

	public Punch(part: BasePart) {
		const HitCharacter = CharacterManager.GetCharacter(part.Parent);
		if (!HitCharacter || this.AlreadyLooked.includes(HitCharacter)) return;
		this.AlreadyLooked.push(HitCharacter);
		const hitAttributes = HitCharacter.Attributes;

		if (hitAttributes.IsBlocking()) {
			if (AbilityInfo.Parryable) {
				const TickParry = tick() - hitAttributes.TickParry();
				if (TickParry <= AbilityInfo.ParryTime) {
					hitAttributes.SetTickParry(tick());
					StunManager.Stun(this.Character, AbilityInfo.ParryStunTime);
					return;
				}
			}

			const HumanoidRootPart = this.Character.HumanoidRootPart;

			if (AbilityInfo.Blockeable) {
				DamageManager.Knockback(
					HitCharacter,
					HumanoidRootPart.CFrame.LookVector.mul(20).add(HumanoidRootPart.CFrame.UpVector.mul(20)),
					0.5,
				);
				return;
			}
		}

		this.CharacterList.push(HitCharacter);

		RagdollManager.UnRagdollCharacter(HitCharacter);
		StunManager.Stun(HitCharacter, 5);
		const ReceiveElectricKick = HitCharacter.Animations.GetAnimation(EAnimations.ReceiveElectricKick);
		ReceiveElectricKick.Play();
		ReceiveElectricKick.TimePosition = this.Animation.TimePosition;
	}

	public Destroy() {
		this.Character.Butler.RemoveList(this.MarkRockHand, this.MarkDamage, this.MarkDamageFinal, this.MarkStop);

		this.Character = undefined!;
		this.CharacterList = undefined!;
		this.AlreadyLooked = undefined!;
		this.Animation = undefined!;
	}
}
