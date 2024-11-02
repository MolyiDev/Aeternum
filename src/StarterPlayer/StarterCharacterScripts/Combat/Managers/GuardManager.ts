// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "../../Managers/StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Humanoid = Character.Humanoid;

const Guard = Animations.GetAnimation(EAnimations.Guard);

let IsGuarding = false;

export class GuardManager {
	public static Start() {
		if (IsGuarding || StateManager.IsInState(EMovementState.Running) || !Tools.IsTouchingGround(Humanoid)) return;
		IsGuarding = true;
		StateManager.SetState(EMovementState.Guarding, true);
		Guard.Play(0.35, 5, 1.5);
	}

	public static Stop() {
		if (!IsGuarding) return;
		IsGuarding = false;
		StateManager.SetState(EMovementState.Guarding, false);
		Guard.Stop(0.35);
	}
}
