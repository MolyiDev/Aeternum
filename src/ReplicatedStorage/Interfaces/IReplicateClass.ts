export interface IReplicateClass {
	Signal?(): void;
	AnimPlay?(animTrack: AnimationTrack, animName: string): void;
	AnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	AnimStop?(animTrack: AnimationTrack, animName: string): void;
	Destroy?(): void;
}
