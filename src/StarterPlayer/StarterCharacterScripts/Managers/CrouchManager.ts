// Imports
import { Players } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

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
const States = Character.States;
const Animations = Character.Animations;
const Tweens = Character.Tweens;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const CrouchMovement = Animations.GetAnimation(EAnimations.CrouchMove);

export class CrouchManager {
	public static CrouchStop() {
		Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, true);
		States.SetState(EMovementState.Crouching, false);

		CrouchMovement.Stop(0.4);

		Tweens.SetCameraFov(ECameraFovs.Default, 0.4);
		Tweens.SetSpeed(EMovementSpeeds.Default, 0.4);
	}

	public static CrouchStart() {
		if (!this.CanCrouch()) return;
		Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
		States.SetState(EMovementState.Crouching, true);

		CrouchMovement.Play(0.4, 1, States.IsMoving() ? 1 : 0);

		Tweens.SetCameraFov(ECameraFovs.Crouch, 0.4);
		Tweens.SetSpeed(EMovementSpeeds.Crouch, 0.4);
	}

	public static CanCrouch() {
		return Tools.IsTouchingGround(Humanoid) && !ExcludeStates.has(States.State);
	}
}

function MoveDirection() {
	if (!States.IsInState(EMovementState.Crouching)) return;

	if (Humanoid.MoveDirection === Vector3.zero) CrouchMovement.AdjustSpeed(0);
	else CrouchMovement.AdjustSpeed(1);
}

Butler.Connect(Humanoid.GetPropertyChangedSignal("MoveDirection"), () => MoveDirection());
Butler.Connect(HumanoidRootPart.GetPropertyChangedSignal("CFrame"), () => MoveDirection());
