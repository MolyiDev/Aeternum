// Imports
import { Players } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([
	EMovementState.Idle,
	EMovementState.Guarding,
	EMovementState.Walking,
	EMovementState.Running,
]);
const ExcludeStates = new Set<EMovementState>([]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Tweens = Character.Tweens;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const Run = Animations.GetAnimation(EAnimations.Run);

const ANIM_SPEED = 2.35;
const MOMENTUM_FINALIZE_DURATION = 10;

let IsRunning = false;
let IsPaused = false;
let ActualSpeed = 0;

export class RunManager {
	public static RunPause() {
		if (IsPaused || !IsRunning) return;
		IsPaused = true;
		Tweens.Pause();
		Run.Stop(0.2);
	}

	public static RunResume() {
		if (!IsPaused || !IsRunning || !this.CanRun()) return;
		IsPaused = false;
		Tweens.Resume();
		Run.Play(0.2, 1, this.AnimForwardSpeed());
	}

	public static RunDeactivate() {
		if (!IsRunning) return;
		IsRunning = false;
		IsPaused = false;
		ActualSpeed = 0;

		Run.Stop(0.35);

		Tweens.SetCameraFov(ECameraFovs.Default, 0.65);

		if (Attributes.IsStunned()) return;
		Tweens.SetSpeed(EMovementSpeeds.Default, 0.65);
		Tweens.SetJump(EMovementJumps.Default, 0.65);
	}

	public static RunActivate() {
		if (!ControlManager.IsKeyDown(ESettingsControls.Sprint)) return;
		if (IsRunning || IsPaused) return;
		IsRunning = true;

		Run.Play(0.2, 1, this.AnimForwardSpeed());

		Tweens.SetCameraFov(ECameraFovs.Run, 1.25);
		Tweens.SetSpeed(EMovementSpeeds.Run, 1.25);
		Tweens.SetJump(EMovementJumps.Run, 1.25);

		let Time = 0;
		while (IsRunning) {
			task.wait(0.05);
			Time += 0.05;
			if (Time < 1.3) continue;
			if (!IsRunning) break;

			Tweens.SetCameraFov(ECameraFovs.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			Tweens.SetSpeed(EMovementSpeeds.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			Tweens.SetJump(EMovementJumps.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			break;
		}
	}

	public static GetSpeed = () => (ActualSpeed === 0 ? EMovementSpeeds.Run : ActualSpeed);

	public static RunStop() {
		States.SetState(EMovementState.Running, false);
		this.RunDeactivate();
	}

	public static CanRun() {
		return Humanoid.MoveDirection.Magnitude > 0 && !Attributes.IsStunned() && IncludeStates.has(States.State);
	}

	public static RunStart() {
		if (IsRunning || !Tools.IsTouchingGround(Humanoid)) return;
		if (this.CanRun()) States.SetState(EMovementState.Running, true);
		else States.SetState(EMovementState.Running, false);
	}

	public static AnimForwardSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimBackSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimLeftSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimRightSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;
}

function MoveDirection() {
	if (IsRunning && Humanoid.MoveDirection === Vector3.zero) RunManager.RunStop();
	if (!ControlManager.IsKeyDown(ESettingsControls.Sprint)) return;
	RunManager.RunStart();
}

Butler.Connect(Humanoid.GetPropertyChangedSignal("MoveDirection"), () => MoveDirection());
Butler.Connect(HumanoidRootPart.GetPropertyChangedSignal("CFrame"), () => MoveDirection());
Butler.Connect(Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => Run.AdjustSpeed(RunManager.AnimForwardSpeed()));
