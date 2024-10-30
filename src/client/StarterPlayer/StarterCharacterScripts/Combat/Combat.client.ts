// Imports
import { Players } from "@rbxts/services";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { StateManager } from "../Managers/StateManager";
import { BlockManager } from "./Managers/BlockManager";
import { ControlManager } from "../Managers/ControlsManager";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { StealthManager } from "./Managers/StealthManager";
import { HeavyManager } from "./Managers/HeavyManager";
import { PunchManager } from "./Managers/PunchManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Butler = Character.Butler;

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Attack1:
			if (StateManager.IsInState(EMovementState.Crouching)) StealthManager.Attack();
			else PunchManager.Attack();
			break;
		case ESettingsControls.Attack2:
			break;
		case ESettingsControls.HeavyAttack:
			HeavyManager.Attack();
			break;
		case ESettingsControls.Block:
			BlockManager.Start();
			break;
	}
}

function InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Block:
			BlockManager.Stop();
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
