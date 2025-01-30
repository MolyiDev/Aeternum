import { Players, UserInputService } from "@rbxts/services";
import RockLibrary from "ReplicatedStorage/Libraries/RockLibrary";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);

UserInputService.InputBegan.Connect((input: InputObject, processed: boolean) => {
	if (processed || input.KeyCode !== Enum.KeyCode.G) return;

	RockLibrary.Explosion(Character.HumanoidRootPart.CFrame.Position, 0.5, 45, 40, 3);
});
