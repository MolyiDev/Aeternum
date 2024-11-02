// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const Character = CharacterManager.GetCharacter(script.Parent!.Parent!.Parent)!;
const Animations = Character.Animations;
const Butler = Character?.Butler;

const IdleAnimations = ReplicatedStorage.WaitForChild("Animations").WaitForChild("Idle");
const AnimationsVariants = IdleAnimations.WaitForChild("Variants");

const IdleDefault = Animations.GetAnimation(EAnimations.IdleDefault);
const LoadedVariants: AnimationTrack[] = [];

const VARIANT_COOLDOWN = 20;

let IdleVariantLoop = false;
let IsIdle = false;

for (const variant of AnimationsVariants.GetChildren()) {
	if (!variant.IsA("Animation")) continue;
	const animVariant = Animations.GetAnimation(variant.Name);
	LoadedVariants.push(animVariant);
	Butler.Connect(animVariant.GetMarkerReachedSignal("End"), () => {
		IdleDefault.Play(0.25, 1, 0.65);
		animVariant.Stop(0.3);
	});
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
