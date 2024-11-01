import { Character } from "shared/Classes/Character";
import { IReplicateClass } from "./IReplicateClass";

export interface IReplicateInfo {
	Ability: boolean;
	Cooldown: number;
	Class: new (character: Character) => IReplicateClass;
}
