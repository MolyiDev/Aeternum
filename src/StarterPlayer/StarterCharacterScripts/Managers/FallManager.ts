/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Animations = Character.Animations;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

const Fall = Animations.GetAnimation(EAnimations.Fall);

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

		States.SetState(EMovementState.Falling, false);
		Fall.Stop(Speed);
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	switch (newState) {
		case Enum.HumanoidStateType.FallingDown:
		case Enum.HumanoidStateType.Flying:
		case Enum.HumanoidStateType.Freefall:
			States.SetState(EMovementState.Falling, true, 0.65);
			break;
		default:
			States.SetState(EMovementState.Falling, false);
			break;
	}
}

Butler.Connect(Humanoid.StateChanged, (oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
	StateChanged(oldState, newState),
);
