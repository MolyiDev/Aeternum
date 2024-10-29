// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Janitor = Character.Janitor;

const Animations = ReplicatedStorage.WaitForChild("Animations").WaitForChild("Idle");
const AnimationsVariants = Animations.WaitForChild("Variants");

const IdleDefault = AnimManager.GetAnimation(Character, EAnimations.IdleDefault);
const LoadedVariants: AnimationTrack[] = [];

const VARIANT_COOLDOWN = 20;

let IdleVariantLoop = false;
let IsIdle = false;

for (const variant of AnimationsVariants.GetChildren()) {
	if (!variant.IsA("Animation")) continue;
	const animVariant = AnimManager.GetAnimation(Character, variant.Name);
	LoadedVariants.push(animVariant);
	Janitor.Add(
		animVariant.GetMarkerReachedSignal("End").Connect(() => {
			IdleDefault.Play(0.25, 1, 0.65);
			animVariant.Stop(0.3);
		}),
	);
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

	public static Initialize = () => StateManager.SetState(EMovementState.Idle, true);
}
