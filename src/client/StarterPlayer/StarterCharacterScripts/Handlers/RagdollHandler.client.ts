// Imports
import { Players } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAttribute } from "shared/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

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

Butler.Connect(Attributes.AttributeChanged, (attribute: string) => AttributeChanged(attribute));
