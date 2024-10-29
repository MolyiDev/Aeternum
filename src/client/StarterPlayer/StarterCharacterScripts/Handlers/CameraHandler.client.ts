import { RunService, Players } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";

const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Janitor = Character.Janitor;
const Humanoid = Character.Humanoid;

function CameraMovement() {
	const currentTime = tick();
	if (Humanoid.WalkSpeed < 16 || Humanoid.Sit || Humanoid.GetState() === Enum.HumanoidStateType.Physics) return;

	if (Humanoid.MoveDirection.Magnitude > 0) {
		const bobbleX = math.cos(currentTime * 10) * 0.25;
		const bobbleY = math.abs(math.sin(currentTime * 10)) * 0.25;
		const bobble = new Vector3(bobbleX, bobbleY, 0);
		Humanoid.CameraOffset = Humanoid.CameraOffset.Lerp(bobble, 0.25);
	} else Humanoid.CameraOffset = Humanoid.CameraOffset.mul(0.75);
}

Janitor.Add(RunService.RenderStepped.Connect(() => CameraMovement()));
