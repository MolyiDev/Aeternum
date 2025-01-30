/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";

// Variables
const Character = CharacterManager.GetCharacterByModel(script.Parent!.Parent)!;
const Styles = Character.Styles;
const Model = Character.Model;

Styles.StylesChanged.Wait();

switch (Model.Name) {
	case "Attacking":
		Styles.Start(EStyleType.Idle);
		while (true) {
			task.wait(0.1);
			Styles.Start(EStyleType.BasicAttack);
		}
	case "Blocking":
		Styles.Start(EStyleType.Idle);
		while (true) {
			task.wait(1);
			Styles.Start(EStyleType.Block);
			task.wait(4);
			Styles.Stop(EStyleType.Block);
		}
	default:
		Styles.Start(EStyleType.Idle);
		break;
}
