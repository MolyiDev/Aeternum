// Imports
import { Players } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { ControlManager } from "../Managers/ControlsManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Moves = Character.Moves;
const States = Character.States;
const Butler = Character.Butler;

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Attack1:
			if (States.IsInState(EMovementState.Crouching)) Moves.Get(EMove.CrouchAttack).Start();
			else if (States.IsInState(EMovementState.Falling)) Moves.Get(EMove.AirAttack).Start();
			else if (States.IsInState(EMovementState.Running)) Moves.Get(EMove.RunAttack).Start();
			else Moves.Get(EMove.BasicAttack).Start();
			break;
		case ESettingsControls.HeavyAttack:
			if (States.IsInState(EMovementState.Attacking)) return;
			Moves.Get(EMove.HeavyAttack).Start();
			break;
		case ESettingsControls.Block:
			Moves.Get(EMove.Block).Start();
			break;
	}
}

function InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Block:
			Moves.Get(EMove.Block).Stop!();
			break;
	}
}

Butler.Connect(
	ControlManager.LocalInputBegan,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) =>
		InputBegan(control, input, doublePressed),
);

Butler.Connect(
	ControlManager.LocalInputEnded,
	(control: [string, number] | undefined, input: InputObject | undefined) => InputEnded(control, input),
);
