import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage } from "@rbxts/services";

// Variables
const AnimFolder = ReplicatedStorage.WaitForChild("Animations");

export class Animations {
	public AnimationPlayed: Signal<[animName: string, animTrack: AnimationTrack]>;
	public AnimationsLoaded: Map<string, AnimationTrack>;
	public Animator: Animator;

	constructor(animator: Animator) {
		this.AnimationPlayed = new Signal<[animName: string, animTrack: AnimationTrack]>();
		this.AnimationsLoaded = new Map<string, AnimationTrack>();
		this.Animator = animator;

		for (const animation of AnimFolder.GetDescendants()) {
			if (!animation.IsA("Animation")) continue;
			this.AnimationsLoaded.set(animation.Name, animator.LoadAnimation(animation));
		}
	}

	public GetAnimation = (animName: string) => this.AnimationsLoaded.get(animName) as AnimationTrack;

	public GetAnimations = (...animNames: string[]) => {
		return animNames.map((animName) => this.AnimationsLoaded.get(animName) as AnimationTrack);
	};

	public Destroy() {
		this.AnimationPlayed.Destroy();
	}
}
