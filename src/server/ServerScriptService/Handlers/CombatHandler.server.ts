// Imports
import { Workspace } from "@rbxts/services";
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { StunManager } from "server/ServerScriptService/Managers/StunManager";
import { AttributeManager } from "shared/Managers/AttributeManager";
import { DamageManager } from "../Managers/DamageManager";
import { IModel } from "shared/Interfaces/IModel";
import { Janitor } from "@rbxts/janitor";
import { IHumanoid } from "shared/Interfaces/IHumanoid";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { HitboxManager } from "../Managers/HitboxManager";

// Constants
const PARRY_TIME = 0.2;

// Variables
const TemporalFolder = Workspace.WaitForChild("Temporal");
const AnimationList = new Set<string>([
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
	EAnimations.HeavyPunch,
]);

const UnParryiableAttacks = new Set<string>([]);
const UnBlockableAttacks = new Set<string>([]);

CharacterManager.AddedCharacter.Connect((character: IModel, janitor: Janitor) => {
	const Humanoid = character.WaitForChild("Humanoid") as Humanoid;
	const HumanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [character];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	janitor.Add(
		Animator.AnimationPlayed.Connect((animationTrack: AnimationTrack) => {
			const animName = Tools.IdAnimToName(animationTrack.Animation!.AnimationId);
			if (!AnimationList.has(animName) || AttributeManager.IsStunnedFull(character)) return;

			const PlayersDamaged: Humanoid[] = [];

			const marker = janitor.Add(
				animationTrack.GetMarkerReachedSignal("Damage").Connect(() => {
					HitboxManager.Create(
						new Vector3(4.5, 5.5, 3.5),
						HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -5)),
						0.15,
						true,
						overlapParams,
						(part: Part) => {
							const hitCharacter = part.Parent as IModel;
							if (!hitCharacter || !hitCharacter.HasTag("Character")) return;
							const hitHumanoid = hitCharacter.Humanoid;
							if (!hitHumanoid || hitHumanoid === Humanoid || PlayersDamaged.includes(hitHumanoid))
								return;
							PlayersDamaged.push(hitHumanoid);
							if (AttributeManager.IsDashing(hitCharacter)) return;

							let Damage = 10;

							if (AttributeManager.IsBlocking(hitCharacter)) {
								if (!UnParryiableAttacks.has(animName)) {
									const TickParry = tick() - AttributeManager.TickParry(hitCharacter);
									if (TickParry <= PARRY_TIME) {
										AttributeManager.SetTickParry(hitCharacter, tick());
										StunManager.Stun(character, 1.5);
										return;
									}
								}

								if (!UnBlockableAttacks.has(animName)) Damage /= 4;
							}

							DamageManager.Damage(hitCharacter, Damage);

							if (animName !== EAnimations.Punch3)
								DamageManager.KnockbackStun(
									hitCharacter,
									HumanoidRootPart.CFrame.LookVector.mul(25),
									0.2,
								);
							else
								DamageManager.KnockbackRagdoll(
									hitCharacter,
									HumanoidRootPart.CFrame.LookVector.mul(60),
									1.25,
									2,
								);
						},
					);
				}),
			);

			janitor.Add(animationTrack.Stopped.Once(() => marker.Disconnect()));
		}),
	);
});
