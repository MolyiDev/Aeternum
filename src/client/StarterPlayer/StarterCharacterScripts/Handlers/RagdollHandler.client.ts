// Imports
import { Players } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAttribute } from "shared/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Janitor = Character.Janitor;

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsRagdoll) return;
	if (Attributes.IsRagdoll()) {
		Humanoid.ChangeState(Enum.HumanoidStateType.Ragdoll);
		Attributes.SetAutoRotate(false);
		Humanoid.PlatformStand = true;
	} else {
		Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
		Attributes.SetAutoRotate(true);
		Humanoid.PlatformStand = false;
	}
}

Janitor.Add(Attributes.AttributeChanged.Connect((attribute) => AttributeChanged(attribute)));
