// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Humanoid = Character.Humanoid;
const Janitor = Character.Janitor;

const Fall = AnimManager.GetAnimation(Character, EAnimations.Fall);

let IsFalling = false;

export class FallManager {
	public static FallingActivate() {
		if (IsFalling) return;
		IsFalling = true;

		Fall.Play(0.2);
	}

	public static FallingDeactivate(speed: number | undefined) {
		if (!IsFalling) return;
		IsFalling = false;
		const Speed = speed ? speed : 0.25;

		StateManager.SetState(EMovementState.Falling, false);
		Fall.Stop(Speed);
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	switch (newState) {
		case Enum.HumanoidStateType.FallingDown:
		case Enum.HumanoidStateType.Flying:
		case Enum.HumanoidStateType.Freefall:
			StateManager.SetState(EMovementState.Falling, true, 0.65);
			break;
		default:
			StateManager.SetState(EMovementState.Falling, false);
			break;
	}
}

Janitor.Add(
	Humanoid.StateChanged.Connect((oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
		StateChanged(oldState, newState),
	),
);
