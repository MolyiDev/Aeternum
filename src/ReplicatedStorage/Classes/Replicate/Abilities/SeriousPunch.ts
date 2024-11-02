// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Character } from "ReplicatedStorage/Classes/Character";

export class SeriousPunch implements IReplicateClass {
	public Character: Character;
	public MarkerRock: RBXScriptConnection = undefined!;
	public MarkerRockLast: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;
	}

	Stop() {
		this.Character.Butler.RemoveList(this.MarkerRock, this.MarkerRockLast);

		this.Character = undefined!;
		this.MarkerRock = undefined!;
		this.MarkerRockLast = undefined!;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Model = Character.Model;
		const Butler = Character.Butler;

		this.MarkerRock = Butler.Connect(animTrack.GetMarkerReachedSignal("Rock"), () => {
			const CF = Model.RightFoot.CFrame;
			RockManager.Crater(CF, 0, 0.35, 1, 5, 1, 0.05);
			RockManager.Explosion(CF.Position, 0.3, 2, 2, 10);
		});

		this.MarkerRockLast = Butler.Connect(animTrack.GetMarkerReachedSignal("RockLast"), () => {
			const CF = Character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.35, 2, 3, 30);
			RockManager.Crater(CF, 6, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 6, 0.45, 8, 20, 2, 0.25));
			RockManager.Trail(Character.HumanoidRootPart.CFrame, 20, 70, 4.5, Vector3.one, 18, 12, 0.35, 4, true, 8, 3);
		});
	}
}
