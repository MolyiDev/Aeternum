// Imports
import { Players } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Attributes = Character.Attributes;
const Tweens = Character.Tweens;
const Butler = Character.Butler;

function AttributeChanged(attribute: string) {
	if (
		attribute !== EAttribute.IsStunnedFull &&
		attribute !== EAttribute.IsStunnedPartial &&
		attribute !== EAttribute.IsStunnedSemiPartial
	)
		return;

	if (Attributes.IsStunned()) {
		States.SetState(EMovementState.Stunned, true);
		if (!Attributes.IsStunnedSemiPartial()) Attributes.SetAutoRotate(false);
		Tweens.SetJump(0, 0);
		Tweens.SetSpeed(0, 0);
	} else {
		States.SetState(EMovementState.Stunned, false);
		if ((Tweens.TargetJump as number) === 0) Tweens.SetJump(EMovementJumps.Default, 0.1);
		if ((Tweens.TargetSpeed as number) === 0) Tweens.SetSpeed(EMovementSpeeds.Default, 0.1);
	}
}

Butler.Connect(Attributes.AttributeChanged, (attribute) => AttributeChanged(attribute));
