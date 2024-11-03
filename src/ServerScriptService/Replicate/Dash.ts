// Imports
import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";

export class Dash implements IReplicateClass {
	public Character: Character;
	public MarkerStart: RBXScriptConnection = undefined!;
	public MarkerEnd: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Attributes = this.Character.Attributes;
		const Butler = this.Character.Butler;

		this.MarkerStart = Butler.Connect(animTrack.GetMarkerReachedSignal("DashStart"), () =>
			Attributes.SetIsDashing(true),
		);
		this.MarkerEnd = Butler.Connect(animTrack.GetMarkerReachedSignal("DashEnd"), () =>
			Attributes.SetIsDashing(false),
		);
	}

	public Destroy() {
		this.Character.Butler.RemoveList(this.MarkerStart, this.MarkerEnd);
		this.Character = undefined!;
	}
}
