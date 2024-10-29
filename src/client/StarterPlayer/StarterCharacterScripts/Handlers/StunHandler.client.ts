// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "../Managers/StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { TweenManager } from "../Managers/TweenManager";
import { EAttribute } from "shared/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Janitor = Character.Janitor;

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsStunnedFull && attribute !== EAttribute.IsStunnedPartial) return;
	if (Attributes.IsStunnedFull() || Attributes.IsStunnedPartial()) {
		StateManager.SetState(EMovementState.Stunned, true);
		TweenManager.SetJump(0, 0);
		TweenManager.SetSpeed(0, 0);
	} else StateManager.SetState(EMovementState.Stunned, false);
}

Janitor.Add(Attributes.AttributeChanged.Connect((attribute) => AttributeChanged(attribute)));
