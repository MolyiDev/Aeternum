// Imports
import { Players } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "../../ReplicatedStorage/Managers/CharacterManager";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStartType } from "ReplicatedStorage/Enums/Style/EStartType";
import { EStopType } from "ReplicatedStorage/Enums/Style/EStopType";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Attributes = Character.Attributes;
const Controls = Character.Controls;
const ShiftLock = Character.ShiftLock;
const Styles = Character.Styles;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

Humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);
Humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Forward:
			if (!Attributes.IsStunned()) Styles.Start(EStyleType.Run, EStartType.Start);
			break;
		case ESettingsControls.Crouch:
			if (
				States.IsInState(EMovementState.Running) &&
				!States.IsInState(EMovementState.Sliding) &&
				States.IsMoving() &&
				!Attributes.IsStunned()
			)
				Styles.Start(EStyleType.Slide, "Normal");
			break;
		case ESettingsControls.Sprint:
			if (!Attributes.IsStunned()) Styles.Start(EStyleType.Run, EStartType.Start);
			break;
		case ESettingsControls.Dash:
			if (!Attributes.IsStunned()) Styles.Start(EStyleType.Dash);
			break;
		case ESettingsControls.Jump:
			if (States.IsInState(EMovementState.Sliding) && !States.IsInState(EMovementState.SlidingJump))
				Styles.Start(EStyleType.Slide, "Impulse");
			else if (States.IsInState(EMovementState.Climbing)) Styles.Stop(EStyleType.Climb, "Normal", true);
			else Styles.Start(EStyleType.Jump, "Double");
			break;
		case ESettingsControls.Climb:
			if (Attributes.IsStunned()) return;
			if (States.IsInState(EMovementState.Climbing)) Styles.Stop(EStyleType.Climb, "Normal", true);
			else Styles.Start(EStyleType.Climb);
			break;
		case ESettingsControls.LockCamera:
			ShiftLock.Toggle();
			break;
	}
}

function InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
	if (!control) return;

	switch (control[0]) {
		case ESettingsControls.Crouch:
			if (States.IsInState(EMovementState.Sliding)) Styles.Stop(EStyleType.Slide);
			break;
		case ESettingsControls.Sprint:
			if (!States.IsInState(EMovementState.Sliding)) Styles.Stop(EStyleType.Run, EStopType.Stop);
			break;
	}
}

function StateChanged(oldState: EMovementState, newState: EMovementState, speed: number | undefined) {
	switch (newState) {
		case EMovementState.Climbing:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Idle);
			Styles.Stop(EStyleType.Jump, speed);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Stop(EStyleType.Run, EStopType.Deactivate);
			break;
		case EMovementState.Walking:
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Start(EStyleType.Walk);
			Styles.Stop(EStyleType.Run, EStopType.Deactivate);
			break;
		case EMovementState.Idle:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Start(EStyleType.Idle);
			break;
		case EMovementState.Falling:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Idle);
			Styles.Start(EStyleType.Fall);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Stop(EStyleType.Climb, "Impulses", speed);
			Styles.Stop(EStyleType.Run, EStopType.Pause);
			break;
		case EMovementState.Running:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Start(EStyleType.Run, EStartType.Activate);
			break;
		case EMovementState.SlidingJump:
		case EMovementState.Sliding:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Land, speed);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Stop(EStyleType.Idle);
			Styles.Stop(EStyleType.Run, EStopType.Pause);
			break;
		case EMovementState.Jumping:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Stop(EStyleType.Land, speed);
			Styles.Stop(EStyleType.Run, EStopType.Pause);
			Styles.Start(EStyleType.Jump, "Normal");
			break;
		case EMovementState.Landing:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Idle);
			Styles.Start(EStyleType.Land);
			Styles.Stop(EStyleType.Jump, speed);
			if (!States.IsInState(EMovementState.SlidingJump) && !States.IsInState(EMovementState.Sliding)) {
				States.SetState(EMovementState.Idle, true);
				Styles.Start(EStyleType.Run, EStartType.Resume);
			}
			break;
		case EMovementState.Blocking:
			Styles.Stop(EStyleType.Run, EStopType.Deactivate);
			break;
		case EMovementState.Guarding:
			break;
		default:
			Styles.Stop(EStyleType.Guard);
			Styles.Stop(EStyleType.Fall, speed);
			Styles.Stop(EStyleType.Walk, speed);
			Styles.Stop(EStyleType.Run, EStopType.Deactivate);
			break;
	}
}

function StyleChanged() {
	Styles.Get(EStyleType.Idle)?.Start();
}

Butler.Connect(
	Controls.InputBeganSignal,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) => {
		InputBegan(control, input, doublePressed);
	},
);

Butler.Connect(Controls.InputEndedSignal, (control: [string, number] | undefined, input: InputObject | undefined) => {
	InputEnded(control, input);
});

Butler.Connect(States.StateChanged, (oldState: EMovementState, newState: EMovementState, speed: number | undefined) =>
	StateChanged(oldState, newState, speed),
);

Butler.Connect(Styles.StylesChanged, () => StyleChanged());
StyleChanged();
