// Imports
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { AirAttackInfo } from "ReplicatedStorage/Moves/Default/Hands/Default_Hands_AirAttack";

@ReplicateInfo(AirAttackInfo)
export class Default_Hands_AirAttack implements IReplicateClass {
	public Character: Character;

	constructor(character: Character) {
		this.Character = character;
	}

	Destroy() {
		this.Character = undefined!;
	}
}
