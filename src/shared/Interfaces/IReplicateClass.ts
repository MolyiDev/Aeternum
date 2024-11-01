export interface IReplicateClass {
	Stop?(): void;
	AnimPlay?(animTrack: AnimationTrack): void;
	AnimPlayOnce?(animTrack: AnimationTrack): void;
	AnimStop?(animTrack: AnimationTrack): void;
}
