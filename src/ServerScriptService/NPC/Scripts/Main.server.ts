/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { ICombatManager } from "ServerScriptService/NPC/Scripts/Interfaces/ICombatManager";
import { IManager } from "./Interfaces/IManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const Character = CharacterManager.GetCharacter(script.Parent!.Parent)!;
const Model = Character.Model;

// Events
const Scripts = Model.WaitForChild("Scripts");
const Managers = Scripts.WaitForChild("Managers");
const Combat = Scripts.WaitForChild("Combat");
const CombatModule = require(Combat.WaitForChild("CombatModule") as ModuleScript) as ICombatManager;
const BlockModule = require(Combat.WaitForChild("BlockModule") as ModuleScript) as IManager;
const IdleModule = require(Managers.WaitForChild("IdleModule") as ModuleScript) as IManager;

switch (Model.Name) {
	case "Attacking":
		while (true) {
			task.wait(0.1);
			CombatModule.Punch();
		}
	case "Blocking":
		IdleModule.Start();
		while (true) {
			task.wait(1);
			BlockModule.Start();
			task.wait(4);
			BlockModule.Stop();
		}
	default:
		IdleModule.Start();
		break;
}
