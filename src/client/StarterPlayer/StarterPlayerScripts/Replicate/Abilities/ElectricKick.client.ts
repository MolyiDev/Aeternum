// Imports
import { RockManager } from "shared/Managers/RockManager";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { AnimManager } from "shared/Managers/AnimManager";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { Character } from "shared/Classes/Character";

// Variables
const Ability = EAbility.ElectricKick;

CharacterManager.AddedCharacter.Connect((character: Character) => {
	const Model = character.Model;
	const Janitor = character.Janitor;

	Janitor.Add(
		character.Animations.AnimationPlayed.Connect((animName, animTrack) => {
			Janitor.Add(
				animTrack.GetMarkerReachedSignal("RockHand").Connect(() => {
					const CF = Model.RightHand.CFrame;
					RockManager.Crater(CF, 0, 0.35, 2, 8, 2, 0.05);
					RockManager.Explosion(CF.Position, 0.3, 2, 2, 10);

					RockManager.Trail(
						character.HumanoidRootPart.CFrame,
						10,
						20,
						1,
						Vector3.one,
						2,
						8,
						0.35,
						4,
						false,
						8,
						3,
					);
				}),
			);

			Janitor.Add(
				animTrack.GetMarkerReachedSignal("RockDown").Connect(() => {
					const CF = character.HumanoidRootPart.CFrame;
					RockManager.Explosion(CF.Position, 0.35, 2, 3, 30);
					RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25);
					delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25));
				}),
			);
		}),
	);
});

AnimManager.AnimationPlayed.Connect((character, animName, animTrack) => {
	if (animName !== Ability) return;
	const Model = character.Model;
	const Janitor = character.Janitor;

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("RockHand").Connect(() => {
			const CF = Model.RightHand.CFrame;
			RockManager.Crater(CF, 0, 0.35, 2, 8, 2, 0.05);
			RockManager.Explosion(CF.Position, 0.3, 2, 2, 10);

			RockManager.Trail(character.HumanoidRootPart.CFrame, 10, 20, 1, Vector3.one, 2, 8, 0.35, 4, false, 8, 3);
		}),
	);

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("RockDown").Connect(() => {
			const CF = character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.35, 2, 3, 30);
			RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25));
		}),
	);
});
