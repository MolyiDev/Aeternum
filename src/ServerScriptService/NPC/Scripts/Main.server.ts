/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { AbilityManager } from "ServerScriptService/Managers/AbilityManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";

// Variables
const Character = CharacterManager.GetCharacterByModel(script.Parent!.Parent)!;
const Abilities = Character.Abilities;
const Styles = Character.Styles;
const Model = Character.Model;

Styles.StylesChanged.Wait();
Styles.Start(EStyleType.Idle);

switch (Model.Name) {
	case "Attacking":
		while (true) {
			task.wait(0.1);
			Styles.Start(EStyleType.BasicAttack);
		}
	case "Blocking":
		while (true) {
			task.wait(1);
			Styles.Start(EStyleType.Block);
			task.wait(4);
			Styles.Stop(EStyleType.Block);
		}
	case "Abilities":
		AbilityManager.AddAbility(Character, 1, EAbility.SeriousPunch);
		AbilityManager.AddAbility(Character, 2, EAbility.ElectricKick);
		AbilityManager.AddAbility(Character, 3, EAbility.GroundSmash);

		while (true) {
			Abilities.Start(math.random(1, 3));
			task.wait(0.5);
		}
}
