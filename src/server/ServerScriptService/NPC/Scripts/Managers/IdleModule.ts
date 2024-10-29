// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { EAnimations } from "shared/Enums/EAnimations";
import { AnimManager } from "shared/Managers/AnimManager";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const Character = script.Parent!.Parent!.Parent as Model;
const Humanoid = Character.WaitForChild("Humanoid") as Humanoid;
const Animator = Humanoid.WaitForChild("Animator") as Animator;
const Janitor = CharacterManager.GetCharacterJanitor(Character);

const Animations = ReplicatedStorage.WaitForChild("Animations").WaitForChild("Idle");
const AnimationsVariants = Animations.WaitForChild("Variants");

const IdleDefault = AnimManager.GetAnimation(Character, EAnimations.IdleDefault);
const LoadedVariants: AnimationTrack[] = [];

const VARIANT_COOLDOWN = 20;

let IdleVariantLoop = false;
let IsIdle = false;

for (const variant of AnimationsVariants.GetChildren()) {
	if (!variant.IsA("Animation")) continue;
	const animVariant = Animator.LoadAnimation(variant);
	LoadedVariants.push(animVariant);
	Janitor.Add(
		animVariant.GetMarkerReachedSignal("End").Connect(() => {
			IdleDefault.Play(0.25, 1, 0.65);
			animVariant.Stop(0.3);
		}),
	);
}

export = {
	IdleVariants() {
		if (LoadedVariants.size() === 0) return;
		IdleVariantLoop = true;

		while (IsIdle) {
			task.wait(VARIANT_COOLDOWN);
			if (!IsIdle) break;

			const randomIndex = math.random(0, LoadedVariants.size() - 1);
			const randomAnimation = LoadedVariants[randomIndex];

			randomAnimation.Play(0.35, 10, 0.85);
		}

		IdleVariantLoop = false;
	},

	Stop() {
		if (!IsIdle) return;
		IsIdle = false;

		IdleDefault.Stop(0.25);
		for (const animation of LoadedVariants) animation.Stop(0.25);
	},

	Start() {
		if (IsIdle) return;
		IsIdle = true;

		IdleDefault.Play(0.3, 1, 0.65);

		if (!IdleVariantLoop) task.spawn(() => this.IdleVariants());
	},
};
