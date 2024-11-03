// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";

export class ElectricKick implements IReplicateClass {
	public Character: Character;
	public MarkerRockHand: RBXScriptConnection = undefined!;
	public MarkerRockDown: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;
	}

	Destroy() {
		this.Character.Butler.RemoveList(this.MarkerRockHand, this.MarkerRockDown);

		this.Character = undefined!;
		this.MarkerRockHand = undefined!;
		this.MarkerRockDown = undefined!;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Model = Character.Model;
		const Butler = Character.Butler;

		this.MarkerRockHand = Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			const CF = Model.RightHand.CFrame;
			RockManager.Crater(CF, 0, 0.35, 2, 8, 2, 0.05);
			RockManager.Explosion(CF.Position, 0.35, 1, 2, 20);

			RockManager.Trail(Character.HumanoidRootPart.CFrame, 10, 20, 1, Vector3.one, 2, 8, 0.35, 4, false, 8, 3);
		});

		this.MarkerRockDown = Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () => {
			const CF = Character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.45, 1, 3, 30);
			RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25));
		});
	}
}
