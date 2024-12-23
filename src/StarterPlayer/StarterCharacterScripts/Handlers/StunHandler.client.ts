// Imports
import { Players } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Attributes = Character.Attributes;
const Tweens = Character.Tweens;
const Butler = Character.Butler;

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsStunnedFull && attribute !== EAttribute.IsStunnedPartial) return;
	if (Attributes.IsStunnedFull() || Attributes.IsStunnedPartial()) {
		States.SetState(EMovementState.Stunned, true);
		Tweens.SetJump(0, 0);
		Tweens.SetSpeed(0, 0);
	} else States.SetState(EMovementState.Stunned, false);
}

Butler.Connect(Attributes.AttributeChanged, (attribute) => AttributeChanged(attribute));
