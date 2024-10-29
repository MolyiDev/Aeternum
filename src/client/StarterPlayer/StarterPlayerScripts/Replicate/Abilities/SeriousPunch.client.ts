// Imports
import { RockManager } from "shared/Managers/RockManager";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const Ability = EAbility.SeriousPunch;

AnimManager.AnimationPlayed.Connect((character, animName, animTrack) => {
	if (animName !== Ability) return;
	const Model = character.Model;
	const Janitor = character.Janitor;

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("Rock").Connect(() => {
			const CF = Model.RightFoot.CFrame;
			RockManager.Crater(CF, 0, 0.35, 1, 5, 1, 0.05);
			RockManager.Explosion(CF.Position, 0.3, 2, 2, 10);
		}),
	);

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("RockLast").Connect(() => {
			const CF = character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.35, 2, 3, 30);
			RockManager.Crater(CF, 6, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 6, 0.45, 8, 20, 2, 0.25));
			RockManager.Trail(character.HumanoidRootPart.CFrame, 20, 70, 4.5, Vector3.one, 18, 12, 0.35, 4, true, 8, 3);
		}),
	);
});
