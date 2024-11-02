// Imports
import { Players, RunService, TweenService, Workspace } from "@rbxts/services";
import { CharacterManager } from "../../../ReplicatedStorage/Managers/CharacterManager";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";

// Variables
const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

Humanoid.WalkSpeed = EMovementSpeeds.Default;
Humanoid.JumpPower = EMovementJumps.Default;
Camera.FieldOfView = ECameraFovs.Default;

let TargetCameraFov = ECameraFovs.Default;
let TargetSpeed = EMovementSpeeds.Default;
let TargetJump = EMovementJumps.Default;

let InitialCameraFov = ECameraFovs.Default;
let InitialSpeed = EMovementSpeeds.Default;
let InitialJump = EMovementJumps.Default;

let InfoCamera = new TweenInfo(0);
let InfoSpeed = new TweenInfo(0);
let InfoJump = new TweenInfo(0);

let TimeElapsedCamera = 0;
let TimeElapsedSpeed = 0;
let TimeElapsedJump = 0;

let IsPaused = false;
let Active = true;

export class TweenManager {
	public static Pause = () => (IsPaused = true);
	public static Resume = () => {
		IsPaused = false;
		Active = true;
	};

	public static SetCameraFov(fov: number, time: number) {
		InitialCameraFov = Camera.FieldOfView;
		TargetCameraFov = fov;
		InfoCamera = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		TimeElapsedCamera = 0;
		this.Resume();
	}

	public static SetSpeed(speed: number, time: number) {
		InitialSpeed = Humanoid.WalkSpeed;
		TargetSpeed = speed;
		InfoSpeed = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		TimeElapsedSpeed = 0;
		this.Resume();
	}

	public static SetJump(jump: number, time: number) {
		InitialJump = Humanoid.JumpPower;
		TargetJump = jump;
		InfoJump = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		TimeElapsedJump = 0;
		this.Resume();
	}
}

function Hearbeat(deltaTime: number) {
	if (!Active || IsPaused) return;
	TimeElapsedCamera = math.min(TimeElapsedCamera + deltaTime, InfoCamera.Time);
	TimeElapsedSpeed = math.min(TimeElapsedSpeed + deltaTime, InfoSpeed.Time);
	TimeElapsedJump = math.min(TimeElapsedJump + deltaTime, InfoJump.Time);

	if (InfoCamera.Time > 0) {
		const alphaCamera = TimeElapsedCamera / InfoCamera.Time;
		const easedAlphaCamera = TweenService.GetValue(alphaCamera, InfoCamera.EasingStyle, InfoCamera.EasingDirection);
		Camera.FieldOfView = InitialCameraFov + (TargetCameraFov - InitialCameraFov) * easedAlphaCamera;
	}

	if (InfoSpeed.Time > 0) {
		const alphaSpeed = TimeElapsedSpeed / InfoSpeed.Time;
		const easedAlphaSpeed = TweenService.GetValue(alphaSpeed, InfoSpeed.EasingStyle, InfoSpeed.EasingDirection);
		Humanoid.WalkSpeed = InitialSpeed + (TargetSpeed - InitialSpeed) * easedAlphaSpeed;
	}

	if (InfoJump.Time > 0) {
		const alphaJump = TimeElapsedJump / InfoJump.Time;
		const easedAlphaJump = TweenService.GetValue(alphaJump, InfoJump.EasingStyle, InfoJump.EasingDirection);
		Humanoid.JumpPower = InitialJump + (TargetJump - InitialJump) * easedAlphaJump;
	}

	if (
		TimeElapsedCamera === InfoCamera.Time &&
		TimeElapsedSpeed === InfoSpeed.Time &&
		TimeElapsedJump === InfoJump.Time
	) {
		Active = false;
	}
}

Butler.Connect(RunService.Heartbeat, (deltaTime) => Hearbeat(deltaTime));
