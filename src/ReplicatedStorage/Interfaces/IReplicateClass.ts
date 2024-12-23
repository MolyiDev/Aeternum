export interface IReplicateClass {
	Signal?(): void;
	AnimPlay?(animTrack: AnimationTrack, animName: string): void;
	AnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	AnimStop?(animTrack: AnimationTrack, animName: string): void;
	SelfAnimPlay?(animTrack: AnimationTrack, animName: string): void;
	SelfAnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	SelfAnimStop?(animTrack: AnimationTrack, animName: string): void;
	Destroy?(): void;
}
