// Imports
import { Players } from "@rbxts/services";
import { ECameraFovs } from "shared/Enums/ECameraFovs";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { Tools } from "shared/Libraries/Tools";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { TweenManager } from "./TweenManager";
import { EAnimations } from "shared/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([]);
const ExcludeStates = new Set<EMovementState>([
	EMovementState.Attacking,
	EMovementState.Sliding,
	EMovementState.Climbing,
]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const CrouchMovement = Animations.GetAnimation(EAnimations.CrouchMove);

export class CrouchManager {
	public static CrouchStop() {
		Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, true);
		StateManager.SetState(EMovementState.Crouching, false);

		CrouchMovement.Stop(0.4);

		TweenManager.SetCameraFov(ECameraFovs.Default, 0.4);
		TweenManager.SetSpeed(EMovementSpeeds.Default, 0.4);
	}

	public static CrouchStart() {
		if (!this.CanCrouch()) return;
		Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
		StateManager.SetState(EMovementState.Crouching, true);

		CrouchMovement.Play(0.4, 1, StateManager.IsMoving() ? 1 : 0);

		TweenManager.SetCameraFov(ECameraFovs.Crouch, 0.4);
		TweenManager.SetSpeed(EMovementSpeeds.Crouch, 0.4);
	}

	public static CanCrouch() {
		return Tools.IsTouchingGround(Humanoid) && !ExcludeStates.has(StateManager.State);
	}
}

function MoveDirection() {
	if (!StateManager.IsInState(EMovementState.Crouching)) return;

	if (Humanoid.MoveDirection === Vector3.zero) CrouchMovement.AdjustSpeed(0);
	else CrouchMovement.AdjustSpeed(1);
}

Butler.Connect(Humanoid.GetPropertyChangedSignal("MoveDirection"), () => MoveDirection());
Butler.Connect(HumanoidRootPart.GetPropertyChangedSignal("CFrame"), () => MoveDirection());
