import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage } from "@rbxts/services";
import { AnimManager } from "shared/Managers/AnimManager";
import { Character } from ".";

// Variables
const AnimFolder = ReplicatedStorage.WaitForChild("Animations");

export class Animations {
	public AnimationPlayOnce: Signal<[animName: string, animTrack: AnimationTrack]>;
	public AnimationPlay: Signal<[animName: string, animTrack: AnimationTrack]>;
	private AnimationsLoaded: Map<string, AnimationTrack>;
	private AnimationsPlayed: Set<string>;

	constructor(character: Character) {
		const Animator = character.Humanoid.WaitForChild("Animator") as Animator;
		const Butler = character.Butler;

		this.AnimationPlayOnce = new Signal<[animName: string, animTrack: AnimationTrack]>();
		this.AnimationPlay = new Signal<[animName: string, animTrack: AnimationTrack]>();

		this.AnimationsLoaded = new Map<string, AnimationTrack>();
		this.AnimationsPlayed = new Set<string>();

		for (const animation of AnimFolder.GetDescendants()) {
			if (!animation.IsA("Animation")) continue;
			this.AnimationsLoaded.set(animation.Name, Animator.LoadAnimation(animation));
		}

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => {
			const animName = AnimManager.IdToName(animTrack.Animation!.AnimationId);

			AnimManager.AnimationPlay.Fire(character, animName, animTrack);
			this.AnimationPlay.Fire(animName, animTrack);

			if (this.AnimationsPlayed.has(animName)) return;
			this.AnimationsPlayed.add(animName);
			AnimManager.AnimationPlayOnce.Fire(character, animName, animTrack);
			this.AnimationPlayOnce.Fire(animName, animTrack);
		});
	}

	public GetAnimation = (animName: string) => this.AnimationsLoaded.get(animName) as AnimationTrack;

	public GetAnimations = (...animNames: string[]) => {
		return animNames.map((animName) => this.AnimationsLoaded.get(animName) as AnimationTrack);
	};

	public Destroy() {
		this.AnimationPlayOnce.Destroy();
	}
}
