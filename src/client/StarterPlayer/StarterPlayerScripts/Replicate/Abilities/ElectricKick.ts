// Imports
import { RockManager } from "shared/Managers/RockManager";
import { Character } from "shared/Classes/Character";

export class ElectricKick {
	public static AnimPlay(character: Character, animTrack: AnimationTrack) {
		const Model = character.Model;
		const Butler = character.Butler;

		const MarkerRockHand = Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			const CF = Model.RightHand.CFrame;
			RockManager.Crater(CF, 0, 0.35, 2, 8, 2, 0.05);
			RockManager.Explosion(CF.Position, 0.3, 2, 2, 10);

			RockManager.Trail(character.HumanoidRootPart.CFrame, 10, 20, 1, Vector3.one, 2, 8, 0.35, 4, false, 8, 3);
		});

		const MarkerRockDown = Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () => {
			const CF = character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.35, 2, 3, 30);
			RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25));
		});

		const Stop = Butler.Once(animTrack.Stopped, () => {
			Butler.RemoveList(MarkerRockHand, MarkerRockDown, Stop);
		});
	}
}
