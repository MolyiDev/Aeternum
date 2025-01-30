export interface IReplicateServer {
	SignalFired(replicateName: string, ...args: Array<unknown>): Array<unknown>;
	SignalFiredServer(replciateName: string, ...args: Array<unknown>): void;
	Destroy(): void;
}
