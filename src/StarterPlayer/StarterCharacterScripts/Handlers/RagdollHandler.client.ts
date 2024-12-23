// Imports
import { Players } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsRagdoll) return;
	if (Attributes.IsRagdoll()) {
		Humanoid.ChangeState(Enum.HumanoidStateType.Physics);
		Humanoid.PlatformStand = true;
		Attributes.SetAutoRotate(false);
	} else {
		Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
		Humanoid.PlatformStand = false;
		Attributes.SetAutoRotate(true);
	}
}

function StateChanged(state: Enum.HumanoidStateType) {
	if (state === Enum.HumanoidStateType.GettingUp) HumanoidRootPart.CanCollide = true;
	else HumanoidRootPart.CanCollide = false;
}

Butler.Connect(Attributes.AttributeChanged, (attribute: string) => AttributeChanged(attribute));
Butler.Connect(Humanoid.StateChanged, (oldState, newState) => StateChanged(newState));
