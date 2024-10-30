// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const Combat = Events.WaitForChild("Combat");
const StealthAttackEvent = Combat.WaitForChild("StealthAttack") as RemoteEvent;

// Constants
const STEALTHATTACK_CD = 6.5;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;

export class StealthManager {
	public static Attack() {
		const TickAS = Attributes.TickAttackStealth() as number;
		if (tick() - TickAS < STEALTHATTACK_CD) return;
		StealthAttackEvent.FireServer();
	}
}
