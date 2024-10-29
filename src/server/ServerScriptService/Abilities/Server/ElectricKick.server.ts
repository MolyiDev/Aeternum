// Imports
import { HitboxManager } from "server/ServerScriptService/Managers/HitboxManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { IModel } from "shared/Interfaces/IModel";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { AttributeManager } from "shared/Managers/AttributeManager";
import { DamageManager } from "server/ServerScriptService/Managers/DamageManager";
import { StunManager } from "server/ServerScriptService/Managers/StunManager";
import { ReplicatedStorage } from "@rbxts/services";
import { EStunType } from "shared/Enums/EStunType";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";
import { EAbility } from "shared/Enums/Abilities/EAbility";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Abilities");
const ElectricKickEvent = Events.WaitForChild("ElectricKickEvent") as RemoteEvent;

// Variables
const Ability = EAbility.ElectricKick;
const AbilityInfo = EAbilityInfo.ElectricKick;

ElectricKickEvent.OnServerEvent.Connect((player) => {
	const Character = player.Character as IModel;
	const Humanoid = Character?.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0 || AttributeManager.IsStunned(Character)) return;

	const Time = tick() - AttributeManager.TickAbility(Character, Ability);
	if (Time < AbilityInfo.Cooldown) return;
	AttributeManager.SetTickAbility(Character, Ability, tick());

	const Janitor = CharacterManager.GetCharacterJanitor(Character);

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [Character];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	const HumanoidRootPart = Character.HumanoidRootPart;

	StunManager.Stun(Character, 1, EStunType.Partial);
	const ElectricKick = AnimManager.GetAnimation(Character, EAnimations.ElectricKick);
	ElectricKick.Play();

	const AlreadyLooked: IModel[] = [];
	const CharacterList: IModel[] = [];

	const markRockHand = Janitor.Add(
		ElectricKick.GetMarkerReachedSignal("RockHand").Connect(() => {
			HitboxManager.Create(
				new Vector3(8, 6, 16),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -12)),
				0.2,
				false,
				overlapParams,
				(part: BasePart) => {
					const hitCharacter = part.Parent as IModel;
					if (!hitCharacter || AlreadyLooked.includes(hitCharacter) || !hitCharacter.HasTag("Character"))
						return;
					AlreadyLooked.push(hitCharacter);
					const hitHumanoid = hitCharacter.Humanoid;
					if (!hitHumanoid) return;

					if (AttributeManager.IsBlocking(hitCharacter)) {
						if (AbilityInfo.Parryable) {
							const TickParry = tick() - AttributeManager.TickParry(hitCharacter);
							if (TickParry <= AbilityInfo.ParryTime) {
								AttributeManager.SetTickParry(hitCharacter, tick());
								StunManager.Stun(Character, AbilityInfo.ParryStunTime);
								return;
							}
						}

						if (AbilityInfo.Blockeable) {
							DamageManager.Knockback(
								hitCharacter,
								HumanoidRootPart.CFrame.LookVector.mul(20).add(
									HumanoidRootPart.CFrame.UpVector.mul(20),
								),
								0.5,
							);
							return;
						}
					}

					CharacterList.push(hitCharacter);

					StunManager.Stun(hitCharacter, 5);
					const ReceiveElectricKick = AnimManager.GetAnimation(hitCharacter, EAnimations.ReceiveElectricKick);
					ReceiveElectricKick.Play();
					ReceiveElectricKick.TimePosition = ElectricKick.TimePosition;
				},
			);

			task.wait(0.2);
			if (CharacterList.size() === 0 || AttributeManager.IsStunnedFull(Character)) {
				ElectricKick.Stop(0.4);
				return;
			}

			StunManager.Stun(Character, 4, EStunType.Partial);
		}),
	);

	const markDamage = Janitor.Add(
		ElectricKick.GetMarkerReachedSignal("Damage").Connect(() => {
			CharacterList.forEach((character) => DamageManager.Damage(character, 10));
		}),
	);

	const markDamageFinal = Janitor.Add(
		ElectricKick.GetMarkerReachedSignal("DamageFinal").Connect(() => {
			CharacterList.forEach((character) => {
				const ReceiveElectricKick = AnimManager.GetAnimation(character, EAnimations.ReceiveElectricKick);
				ReceiveElectricKick.Stop();
				DamageManager.Damage(character, 20);
				DamageManager.KnockbackRagdoll(
					character,
					Character.HumanoidRootPart.CFrame.LookVector.mul(100),
					0.85,
					5,
				);
			});
		}),
	);

	Janitor.Add(
		ElectricKick.Stopped.Once(() => {
			markRockHand.Disconnect();
			markDamage.Disconnect();
			markDamageFinal.Disconnect();
		}),
	);
});
