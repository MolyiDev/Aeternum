// Imports
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CrouchAttackInfo } from "ReplicatedStorage/Moves/Default/Hands/Default_Hands_CrouchAttack";
import { Character } from "ReplicatedStorage/Classes/Character";

@ReplicateInfo(CrouchAttackInfo)
export class Default_Hands_CrouchAttack implements IReplicateClass {
	public Character: Character;

	constructor(character: Character) {
		this.Character = character;
	}

	Destroy() {
		this.Character = undefined!;
	}
}
