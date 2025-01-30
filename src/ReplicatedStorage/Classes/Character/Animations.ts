import { ReplicatedStorage } from "@rbxts/services";
import { Character } from ".";

// Variables
const AnimFolder = ReplicatedStorage.WaitForChild("Animations").GetDescendants();
const AnimationsPerName: Map<string, Animation> = new Map();

for (const animation of AnimFolder) {
	if (!animation.IsA("Animation")) continue;
	AnimationsPerName.set(animation.Name, animation);
}

export class Animations {
	private AnimationsLoaded: Map<string, AnimationTrack>;
	public Animator: Animator;

	constructor(character: Character) {
		this.Animator = character.Humanoid.WaitForChild("Animator") as Animator;
		this.AnimationsLoaded = new Map<string, AnimationTrack>();
	}

	public LoadAnimation = (animName: string) => {
		const Animation = this.Animator.LoadAnimation(AnimationsPerName.get(animName) as Animation);
		this.AnimationsLoaded.set(animName, Animation);
		return Animation;
	};

	public GetAnimation = (animName: string) => this.AnimationsLoaded.get(animName) ?? this.LoadAnimation(animName);

	public GetAnimations = (...animNames: string[]) => {
		return animNames.map((animName) => this.AnimationsLoaded.get(animName) ?? this.LoadAnimation(animName));
	};

	public Destroy() {
		this.AnimationsLoaded.clear();

		this.AnimationsLoaded = undefined!;
		this.Animator = undefined!;
	}
}
