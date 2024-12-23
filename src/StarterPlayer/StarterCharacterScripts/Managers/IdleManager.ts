// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Animations = Character.Animations;
const Butler = Character.Butler;

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

export class IdleManager {
	private static IdleVariants() {
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
	}

	public static IdleDeactivate() {
		if (!IsIdle) return;
		IsIdle = false;

		IdleDefault.Stop(0.25);
		for (const animation of LoadedVariants) animation.Stop(0.25);
	}

	public static IdleActivate() {
		if (IsIdle) return;
		IsIdle = true;

		IdleDefault.Play(0.3, 1, 0.65);

		if (!IdleVariantLoop) task.spawn(() => this.IdleVariants());
	}

	public static Initialize = () => States.SetState(EMovementState.Idle, true);
}
