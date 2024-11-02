// Imports
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { ReplicatedStorage } from "@rbxts/services";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EAbilityInfo } from "ReplicatedStorage/Enums/Abilities/EAbilityInfo";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from "ReplicatedStorage/Classes/Character";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Abilities");
const ElectricKickEvent = Events.WaitForChild("ElectricKickEvent") as RemoteEvent;

// Variables
const Ability = EAbility.ElectricKick;
const AbilityInfo = EAbilityInfo.ElectricKick;

ElectricKickEvent.OnServerEvent.Connect((player) => {
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const Attributes = Character.Attributes;
	const Humanoid = Character.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0 || Attributes.IsStunned()) return;

	const Time = tick() - Attributes.TickAbility(Ability);
	if (Time < AbilityInfo.Cooldown) return;

	Attributes.SetUsingAbility(Ability);

	const Animations = Character.Animations;
	const Model = Character.Model;
	const Butler = Character.Butler;

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [Model];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	const HumanoidRootPart = Character.HumanoidRootPart;

	StunManager.Stun(Character, 1, EStunType.Partial);
	const ElectricKick = Animations.GetAnimation(EAnimations.ElectricKick);
	ElectricKick.Play();

	const AlreadyLooked: Character[] = [];
	const CharacterList: Character[] = [];

	const MarkRockHand = Butler.Connect(ElectricKick.GetMarkerReachedSignal("RockHand"), () => {
		HitboxManager.Create(
			new Vector3(8, 6, 16),
			HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -12)),
			0.2,
			false,
			overlapParams,
			(part: BasePart) => {
				const hitCharacter = CharacterManager.GetCharacter(part.Parent);
				if (!hitCharacter || AlreadyLooked.includes(hitCharacter)) return;
				AlreadyLooked.push(hitCharacter);
				const hitHumanoid = hitCharacter.Humanoid;
				if (!hitHumanoid) return;
				const hitAttributes = hitCharacter.Attributes;

				if (hitAttributes.IsBlocking()) {
					if (AbilityInfo.Parryable) {
						const TickParry = tick() - hitAttributes.TickParry();
						if (TickParry <= AbilityInfo.ParryTime) {
							hitAttributes.SetTickParry(tick());
							StunManager.Stun(Character, AbilityInfo.ParryStunTime);
							return;
						}
					}

					if (AbilityInfo.Blockeable) {
						DamageManager.Knockback(
							hitCharacter,
							HumanoidRootPart.CFrame.LookVector.mul(20).add(HumanoidRootPart.CFrame.UpVector.mul(20)),
							0.5,
						);
						return;
					}
				}

				const hitAnimations = hitCharacter.Animations;

				CharacterList.push(hitCharacter);

				StunManager.Stun(hitCharacter, 5);
				const ReceiveElectricKick = hitAnimations.GetAnimation(EAnimations.ReceiveElectricKick);
				ReceiveElectricKick.Play();
				ReceiveElectricKick.TimePosition = ElectricKick.TimePosition;
			},
		);

		task.wait(0.2);
		if (CharacterList.size() === 0 || Attributes.IsStunnedFull()) {
			ElectricKick.Stop(0.4);
			return;
		}

		StunManager.Stun(Character, 4, EStunType.Partial);
	});

	const MarkDamage = Butler.Connect(ElectricKick.GetMarkerReachedSignal("Damage"), () => {
		CharacterList.forEach((character) => DamageManager.Damage(character, 10));
	});

	const MarkDamageFinal = Butler.Connect(ElectricKick.GetMarkerReachedSignal("DamageFinal"), () => {
		CharacterList.forEach((character) => {
			const Animations = character.Animations;
			const ReceiveElectricKick = Animations.GetAnimation(EAnimations.ReceiveElectricKick);
			ReceiveElectricKick.Stop();
			DamageManager.Damage(character, 20);
			DamageManager.KnockbackRagdoll(character, Character.HumanoidRootPart.CFrame.LookVector.mul(100), 0.85, 5);
		});
	});

	const Stop = Butler.Once(ElectricKick.Stopped, () => {
		Butler.RemoveList(MarkRockHand, MarkDamage, MarkDamageFinal, Stop);
		Attributes.SetTickAbility(Ability, tick());
		Attributes.SetUsingAbility(undefined);
	});
});
