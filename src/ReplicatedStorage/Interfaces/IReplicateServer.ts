import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { Character } from "ReplicatedStorage/Classes/Character";

export interface IReplicateServer {
	Character: Character;
	ReplicateModules: Map<string, CReplicate>;
	ReplicatesPlayed: Set<string>;
	SignalFired(replicateName: string, ...args: Array<unknown>): Array<unknown>;
	SignalFiredServer(replciateName: string, ...args: Array<unknown>): void;
	Destroy(): void;
}
