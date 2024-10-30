// Imports
import { Workspace } from "@rbxts/services";
import { EAnimations } from "shared/Enums/EAnimations";
import { StunManager } from "server/ServerScriptService/Managers/StunManager";
import { DamageManager } from "../Managers/DamageManager";
import { IModel } from "shared/Interfaces/IModel";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { HitboxManager } from "../Managers/HitboxManager";
import { AnimManager } from "shared/Managers/AnimManager";
import { Character } from "shared/Classes/Character";

// Constants
const PARRY_TIME = 0.2;

// Variables
const AnimationList = new Set<string>([
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
	EAnimations.HeavyPunch,
]);

const UnParryiableAttacks = new Set<string>([]);
const UnBlockableAttacks = new Set<string>([]);

CharacterManager.AddedCharacter.Connect((character) => {
	const Butler = character.Butler;
	const Model = character.Model;
	const Attributes = character.Attributes;
	const Humanoid = character.Humanoid;
	const HumanoidRootPart = character.HumanoidRootPart;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [Model];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	Butler.Connect(Animator.AnimationPlayed, (animationTrack: AnimationTrack) => {
		const animName = AnimManager.IdToName(animationTrack.Animation!.AnimationId);
		if (!AnimationList.has(animName) || Attributes.IsStunnedFull()) return;

		const CharactersDamaged: Character[] = [];

		const Marker = Butler.Connect(animationTrack.GetMarkerReachedSignal("Damage"), () => {
			HitboxManager.Create(
				new Vector3(4.5, 5.5, 3.5),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -5)),
				0.15,
				true,
				overlapParams,
				(part: Part) => {
					const hitCharacter = CharacterManager.GetCharacter(part.Parent);
					if (!hitCharacter || CharactersDamaged.includes(character)) return;
					CharactersDamaged.push(hitCharacter);

					const hitHumanoid = hitCharacter.Humanoid;
					if (!hitHumanoid) return;

					const hitAttributes = hitCharacter.Attributes;
					if (hitAttributes.IsDashing()) return;

					let Damage = 10;

					if (hitAttributes.IsBlocking()) {
						if (!UnParryiableAttacks.has(animName)) {
							const TickParry = tick() - hitAttributes.TickParry();
							if (TickParry <= PARRY_TIME) {
								hitAttributes.SetTickParry(tick());
								StunManager.Stun(character, 1.5);
								return;
							}
						}

						if (!UnBlockableAttacks.has(animName)) Damage /= 4;
					}

					DamageManager.Damage(hitCharacter, Damage);

					if (animName !== EAnimations.Punch3)
						DamageManager.KnockbackStun(hitCharacter, HumanoidRootPart.CFrame.LookVector.mul(25), 0.2);
					else
						DamageManager.KnockbackRagdoll(
							hitCharacter,
							HumanoidRootPart.CFrame.LookVector.mul(60),
							1.25,
							2,
						);
				},
			);
		});

		const Stop = Butler.Once(animationTrack.Stopped, () => {
			Butler.RemoveList(Marker, Stop);
		});
	});
});
