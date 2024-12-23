import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";

export interface IMove {
	Start(): void;
	Stop?(): void;
	Destroy(): void;
}
