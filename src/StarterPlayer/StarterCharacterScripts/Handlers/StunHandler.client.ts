// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "../Managers/StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { TweenManager } from "../Managers/TweenManager";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Butler = Character.Butler;

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsStunnedFull && attribute !== EAttribute.IsStunnedPartial) return;
	if (Attributes.IsStunnedFull() || Attributes.IsStunnedPartial()) {
		StateManager.SetState(EMovementState.Stunned, true);
		TweenManager.SetJump(0, 0);
		TweenManager.SetSpeed(0, 0);
	} else StateManager.SetState(EMovementState.Stunned, false);
}

Butler.Connect(Attributes.AttributeChanged, (attribute) => AttributeChanged(attribute));
