// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { BlockInfo } from "ReplicatedStorage/Moves/Default/Hands/Default_Hands_Block";

@ReplicateInfo(BlockInfo)
export class Default_Hands_Block implements IReplicateClass {
	public Attributes: Attributes;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
	}

	public AnimPlay(animTrack: AnimationTrack): void {
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
