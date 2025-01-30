import { Character } from "ReplicatedStorage/Classes/Character";

export interface IRagdollManager {
	UnRagdollCharacter(character: Character): void;
	RagdollCharacter(character: Character, duration: number): void;
}
