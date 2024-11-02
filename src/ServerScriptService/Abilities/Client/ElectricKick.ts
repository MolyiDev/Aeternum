// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Abilities");
const ElectricKickEvent = Events.WaitForChild("ElectricKickEvent") as RemoteEvent;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;

const Ability = EAbility.ElectricKick;

export = {
	Start() {
		if (Attributes.IsStunned() || !Tools.IsTouchingGround(Humanoid, true)) return;

		ElectricKickEvent.FireServer();
	},

	GetAbility() {
		return Ability;
	},
};
