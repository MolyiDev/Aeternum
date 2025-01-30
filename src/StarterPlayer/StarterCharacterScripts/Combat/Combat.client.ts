// Imports
import { Players } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Controls = Character.Controls;
const Styles = Character.Styles;
const States = Character.States;
const Butler = Character.Butler;
const WaitTime = 0.1;

let AttackClick = false;
let BlockClick = false;

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Attack1:
			if (States.IsInState(EMovementState.Running)) Styles.Start(EStyleType.RunAttack);
			else Styles.Start(EStyleType.BasicAttack);

			AttackClick = true;
			task.wait(WaitTime);
			while (AttackClick) {
				if (!States.IsInState(EMovementState.Running)) Styles.StartConstant(EStyleType.BasicAttack);
				task.wait(WaitTime);
			}
			break;
		case ESettingsControls.Block:
			Styles.Start(EStyleType.Block);

			BlockClick = true;
			task.wait(WaitTime);
			while (BlockClick) {
				Styles.StartConstant(EStyleType.Block);
				task.wait(WaitTime);
			}
			break;
	}
}

function InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Attack1:
			AttackClick = false;
			break;
		case ESettingsControls.Block:
			BlockClick = false;
			Styles.Stop(EStyleType.Block);
			break;
	}
}

Butler.Connect(
	Controls.InputBeganSignal,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) =>
		InputBegan(control, input, doublePressed),
);

Butler.Connect(Controls.InputEndedSignal, (control: [string, number] | undefined, input: InputObject | undefined) =>
	InputEnded(control, input),
);
