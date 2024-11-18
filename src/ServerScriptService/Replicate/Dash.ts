// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";

@ReplicateInfo({
	[EAnimations.DashForward]: { Sound: true, Cooldown: 2.5 },
	[EAnimations.DashBack]: { Sound: true, Cooldown: 2.5 },
	[EAnimations.DashLeft]: { Sound: true, Cooldown: 2.5 },
	[EAnimations.DashRight]: { Sound: true, Cooldown: 2.5 },
})
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
