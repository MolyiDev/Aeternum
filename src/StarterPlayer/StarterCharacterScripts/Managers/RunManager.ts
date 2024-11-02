// Imports
import { Players } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { StateManager } from "./StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { TweenManager } from "./TweenManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([EMovementState.Idle, EMovementState.Walking, EMovementState.Running]);
const ExcludeStates = new Set<EMovementState>([]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
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
		TweenManager.Pause();
		Run.Stop(0.2);
	}

	public static RunResume() {
		if (!IsPaused || !IsRunning || !this.CanRun()) return;
		IsPaused = false;
		TweenManager.Resume();
		Run.Play(0.2, 1, this.AnimForwardSpeed());
	}

	public static RunDeactivate() {
		if (!IsRunning) return;
		IsRunning = false;
		IsPaused = false;
		ActualSpeed = 0;

		Run.Stop(0.35);

		TweenManager.SetCameraFov(ECameraFovs.Default, 0.65);

		if (Attributes.IsStunned()) return;
		TweenManager.SetSpeed(EMovementSpeeds.Default, 0.65);
		TweenManager.SetJump(EMovementJumps.Default, 0.65);
	}

	public static RunActivate() {
		if (!ControlManager.IsKeyDown(ESettingsControls.Sprint)) return;
		if (IsRunning || IsPaused) return;
		IsRunning = true;

		Run.Play(0.2, 1, this.AnimForwardSpeed());

		TweenManager.SetCameraFov(ECameraFovs.Run, 1.25);
		TweenManager.SetSpeed(EMovementSpeeds.Run, 1.25);
		TweenManager.SetJump(EMovementJumps.Run, 1.25);

		let Time = 0;
		while (IsRunning) {
			task.wait(0.05);
			Time += 0.05;
			if (Time < 1.3) continue;
			if (!IsRunning) break;

			TweenManager.SetCameraFov(ECameraFovs.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			TweenManager.SetSpeed(EMovementSpeeds.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			TweenManager.SetJump(EMovementJumps.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			break;
		}
	}

	public static GetSpeed = () => (ActualSpeed === 0 ? EMovementSpeeds.Run : ActualSpeed);

	public static RunStop() {
		StateManager.SetState(EMovementState.Running, false);
		this.RunDeactivate();
	}

	public static CanRun() {
		return Humanoid.MoveDirection.Magnitude > 0 && !Attributes.IsStunned() && IncludeStates.has(StateManager.State);
	}

	public static RunStart() {
		if (IsRunning || !Tools.IsTouchingGround(Humanoid)) return;
		if (this.CanRun()) StateManager.SetState(EMovementState.Running, true);
		else StateManager.SetState(EMovementState.Running, false);
	}

	public static AnimForwardSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimBackSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimLeftSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public static AnimRightSpeed = () => (Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;
}

function MoveDirection() {
	if (!ControlManager.IsKeyDown(ESettingsControls.Sprint)) return;
	RunManager.RunStart();
}

Butler.Connect(Humanoid.GetPropertyChangedSignal("MoveDirection"), () => MoveDirection());
Butler.Connect(HumanoidRootPart.GetPropertyChangedSignal("CFrame"), () => MoveDirection());
Butler.Connect(Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => Run.AdjustSpeed(RunManager.AnimForwardSpeed()));
