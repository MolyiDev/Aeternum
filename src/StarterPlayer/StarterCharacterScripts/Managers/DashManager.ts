// Imports
import { Players } from "@rbxts/services";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EDashDirection } from "ReplicatedStorage/Enums/Dash/EDashDirection";
import { EDashMode } from "ReplicatedStorage/Enums/Dash/EDashMode";

// States
const IncludeStates = new Set<EMovementState>([]);
const ExcludeStates = new Set<EMovementState>([EMovementState.Sliding]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Tweens = Character.Tweens;
const States = Character.States;
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Butler = Character.Butler;

const [DashForward, DashBack, DashLeft, DashRight] = Animations.GetAnimations(
	EAnimations.DashForward,
	EAnimations.DashBack,
	EAnimations.DashLeft,
	EAnimations.DashRight,
);

const DASH_COOLDOWN = 0;
const DASH_DURATION = 0.45;
const DASH_START_SPEED = 55;
const DASH_END_SPEED = 16;

let CanDash = true;

export class DashManager {
	public static DashStart() {
		if (!CanDash || ExcludeStates.has(States.State)) return;

		const moveDirection = DashManager.GetDashDirection();
		if (moveDirection === undefined) return;

		CanDash = false;
		const dashMode = Attributes.IsCameraLocked() ? EDashMode.Camera : EDashMode.Root;

		Tweens.SetDash({
			Direction: moveDirection,
			Mode: dashMode,
			Time: DASH_DURATION,
			InitialSpeed: DASH_START_SPEED,
			FinalSpeed: DASH_END_SPEED,
			Stun: true,
		});

		delay(DASH_COOLDOWN, () => {
			CanDash = true;
		});
	}

	private static GetDashDirection(): EDashDirection | undefined {
		const cameraLocked = Attributes.IsCameraLocked();
		let direction: EDashDirection | undefined;

		if (ControlManager.IsKeyDown(ESettingsControls.Forward)) {
			direction = EDashDirection.Forward;
			DashForward.Play(0.1);
		}

		if (ControlManager.IsKeyDown(ESettingsControls.Back)) {
			if (direction === EDashDirection.Forward) direction = undefined;
			else direction = EDashDirection.Back;

			if (!cameraLocked) DashForward.Play(0.1);
			else DashBack.Play(0.1);
		}

		if (ControlManager.IsKeyDown(ESettingsControls.Left)) {
			switch (direction) {
				case EDashDirection.Forward:
					direction = EDashDirection.ForwardLeft;
					break;
				case EDashDirection.Back:
					direction = EDashDirection.BackLeft;
					break;
				default:
					direction = EDashDirection.Left;
					break;
			}

			if (!cameraLocked) DashForward.Play(0.1);
			else DashLeft.Play(0.1);
		}

		if (ControlManager.IsKeyDown(ESettingsControls.Right)) {
			switch (direction) {
				case EDashDirection.Forward:
					direction = EDashDirection.ForwardRight;
					break;
				case EDashDirection.ForwardLeft:
					direction = EDashDirection.Forward;
					break;
				case EDashDirection.Back:
					direction = EDashDirection.BackRight;
					break;
				case EDashDirection.BackLeft:
					direction = EDashDirection.Back;
					break;
				case EDashDirection.Left:
					direction = undefined;
					break;
				default:
					direction = EDashDirection.Right;
					break;
			}

			if (!cameraLocked) DashForward.Play(0.1);
			else DashRight.Play(0.1);
		}

		if (direction === undefined) {
			DashBack.Play(0.1);
			return EDashDirection.Back;
		} else return direction;
	}
}

Butler.Connect(DashForward.GetMarkerReachedSignal("End"), () => DashForward.Stop(0.3));
Butler.Connect(DashBack.GetMarkerReachedSignal("End"), () => DashBack.Stop(0.3));
Butler.Connect(DashLeft.GetMarkerReachedSignal("End"), () => DashLeft.Stop(0.3));
Butler.Connect(DashRight.GetMarkerReachedSignal("End"), () => DashRight.Stop(0.3));
