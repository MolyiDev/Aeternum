import { ReplicatedStorage } from "@rbxts/services";
import { Character } from ".";

// Variables
const AnimFolder = ReplicatedStorage.WaitForChild("Animations");

export class Animations {
	private AnimationsLoaded: Map<string, AnimationTrack>;

	constructor(character: Character) {
		const Animator = character.Humanoid.WaitForChild("Animator") as Animator;

		this.AnimationsLoaded = new Map<string, AnimationTrack>();

		for (const animation of AnimFolder.GetDescendants()) {
			if (!animation.IsA("Animation")) continue;
			this.AnimationsLoaded.set(animation.Name, Animator.LoadAnimation(animation));
		}
	}

	public GetAnimation = (animName: string) => this.AnimationsLoaded.get(animName) as AnimationTrack;

	public GetAnimations = (...animNames: string[]) => {
		return animNames.map((animName) => this.AnimationsLoaded.get(animName) as AnimationTrack);
	};

	public Destroy() {
		this.AnimationsLoaded.clear();
	}
}
