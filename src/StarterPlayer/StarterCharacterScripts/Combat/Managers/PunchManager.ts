// Imports
import { Players } from "@rbxts/services";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { StateManager } from "../../Managers/StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { GuardManager } from "./GuardManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

const [Punch0, Punch1, Punch2, Punch3] = Animations.GetAnimations(
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
);

const DEFAULT_CAMERA_OFFSET = new Vector3(0, 0, 0);
const CAMERA_INTENSITY = 0.3;
const PUNCH_TIMEOUT = 1.75;

let CanPunch = true;

let CurrentPunch = 0;
let LastPunchTime = tick();

let OffsetTween: Tween;
let OffsettConnection: RBXScriptConnection | undefined;

interface PunchConfig {
	Animation: AnimationTrack;
	CameraOffsetX: number;
	CameraOffsetY: number;
	CameraTime: number;
	PunchCooldown: number;
}

const Punches = new Map<number, PunchConfig>([
	[
		0,
		{
			Animation: Punch0,
			CameraOffsetX: 1,
			CameraOffsetY: 1,
			CameraTime: 0.42,
			PunchCooldown: 0.42,
		},
	],
	[
		1,
		{
			Animation: Punch1,
			CameraOffsetX: -1,
			CameraOffsetY: 1,
			CameraTime: 0.34,
			PunchCooldown: 0.36,
		},
	],
	[
		2,
		{
			Animation: Punch2,
			CameraOffsetX: 1,
			CameraOffsetY: 1,
			CameraTime: 0.28,
			PunchCooldown: 0.32,
		},
	],
	[
		3,
		{
			Animation: Punch3,
			CameraOffsetX: -1,
			CameraOffsetY: 1,
			CameraTime: 0.32,
			PunchCooldown: 1.25,
		},
	],
]);

function ApplyCameraOffset(newPunch: PunchConfig) {
	OffsetTween?.Pause();
	if (OffsettConnection) {
		Butler.Remove(OffsettConnection);
		OffsettConnection = undefined;
	}

	OffsetTween = Tools.TweenPlay(
		Humanoid,
		new TweenInfo(newPunch.CameraTime, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
		{
			CameraOffset: new Vector3(
				newPunch.CameraOffsetX * CAMERA_INTENSITY,
				newPunch.CameraOffsetY * CAMERA_INTENSITY,
				Humanoid.CameraOffset.Z,
			),
		},
	);

	OffsettConnection = Butler.Once(OffsetTween.Completed, () =>
		Tools.TweenPlay(Humanoid, new TweenInfo(0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			CameraOffset: DEFAULT_CAMERA_OFFSET,
		}),
	);
}

function ResetPunchIfIdle() {
	task.delay(PUNCH_TIMEOUT, () => {
		if (tick() - LastPunchTime >= PUNCH_TIMEOUT && CurrentPunch !== 0) CurrentPunch = 0;
	});
}

export class PunchManager {
	public static Attack() {
		if (!CanPunch || Attributes.IsStunned() || Attributes.IsBlocking()) return;
		if (CurrentPunch >= Punches.size()) CurrentPunch = 0;

		LastPunchTime = tick();
		ResetPunchIfIdle();

		const PrevPunch = Punches.get(CurrentPunch - 1);
		const NewPunch = Punches.get(CurrentPunch) as PunchConfig;

		CurrentPunch++;
		StateManager.SetState(EMovementState.Attacking, true, 0.1);
		CanPunch = false;

		if (PrevPunch) PrevPunch.Animation.Stop(0.125);
		NewPunch.Animation.Play(0.125);

		ApplyCameraOffset(NewPunch);

		task.wait(NewPunch.PunchCooldown);
		StateManager.SetState(EMovementState.Attacking, false);

		CanPunch = true;
	}
}

Butler.Connect(Punch0.GetMarkerReachedSignal("End"), () => GuardManager.Start());
Butler.Connect(Punch1.GetMarkerReachedSignal("End"), () => GuardManager.Start());
Butler.Connect(Punch2.GetMarkerReachedSignal("End"), () => GuardManager.Start());
Butler.Connect(Punch3.GetMarkerReachedSignal("End"), () => GuardManager.Start());
