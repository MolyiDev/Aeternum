import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "./IReplicateClass";

export interface IReplicateInfo {
	Ability: boolean;
	Cooldown: number;
	Class: new (character: Character) => IReplicateClass;
}
