// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";

@ReplicateInfo({
	[EAnimations.Block]: { Sound: true, Cooldown: 0 },
})
export class Block implements IReplicateClass {
	public Attributes: Attributes;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.Attributes.SetIsBlocking(true);
		this.Attributes.SetTickParry(tick());
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		this.Attributes.SetIsBlocking(false);
	}

	public Destroy() {
		this.Attributes = undefined!;
	}
}
