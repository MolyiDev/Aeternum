import { Character } from ".";

export class ReplicateServer {
	public Character: Character;

	constructor(character: Character) {
		this.Character = character;
	}

	public CanPlayAnimation(animTrack: AnimationTrack) {}
}
