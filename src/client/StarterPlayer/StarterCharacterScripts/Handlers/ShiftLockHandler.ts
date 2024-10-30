// Imports
import { Workspace, Players, RunService, UserInputService } from "@rbxts/services";
import Spring from "@rbxts/spring";
import { EAttribute } from "shared/Enums/EAttribute";
import { CharacterManager } from "shared/Managers/CharacterManager";

interface ConfigType {
	CHARACTER_ROTATION_SPEED: number;
	TRANSITION_SPRING_DAMPER: number;
	CAMERA_TRANSITION_IN_SPEED: number;
	CAMERA_TRANSITION_OUT_SPEED: number;
	LOCKED_CAMERA_OFFSET: Vector3;
	LOCKED_MOUSE_ICON: string;
}

const Config: ConfigType = {
	CHARACTER_ROTATION_SPEED: 3,
	TRANSITION_SPRING_DAMPER: 0.7,
	CAMERA_TRANSITION_IN_SPEED: 10,
	CAMERA_TRANSITION_OUT_SPEED: 10,
	LOCKED_CAMERA_OFFSET: new Vector3(1.75, 0.25, 0),
	LOCKED_MOUSE_ICON: "http://www.roblox.com/asset/?id=14891607998", // "rbxasset://textures/MouseLockedCursor.png",
};

let Enabled = false;
let AutoRotate = true;
const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;
const Mouse = Player.GetMouse();
const CameraSpring = new Spring(new Vector3(0, 0, 0));
CameraSpring.Damper = Config.TRANSITION_SPRING_DAMPER;

export class ShiftLockHandler {
	public static Toggle() {
		if (Enabled) {
			CameraSpring.Speed = Config.CAMERA_TRANSITION_OUT_SPEED;
			CameraSpring.Target = new Vector3(0, 0, 0);
			this.Disable();
		} else {
			CameraSpring.Speed = Config.CAMERA_TRANSITION_IN_SPEED;
			CameraSpring.Target = Config.LOCKED_CAMERA_OFFSET;
			this.Enable();
		}
	}

	private static Enable() {
		if (Enabled) return;
		Humanoid.AutoRotate = false;
		Enabled = true;
		Attributes.SetIsCameraLocked(true);
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
		Mouse.Icon = Config.LOCKED_MOUSE_ICON;
	}

	private static Disable() {
		if (!Enabled) return;
		Enabled = false;
		Humanoid.AutoRotate = true;
		Attributes.SetIsCameraLocked(false);
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		Mouse.Icon = "";
	}
}

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.AutoRotate) return;
	AutoRotate = Attributes.IsAutoRotate();
}

function RenderStepped(deltaTime: number) {
	Camera.CFrame = Camera.CFrame.mul(new CFrame(CameraSpring.Position));

	if (!AutoRotate || !Enabled) return;
	const [x, y, z] = Camera.CFrame.ToOrientation();
	HumanoidRootPart.CFrame = HumanoidRootPart.CFrame.Lerp(
		new CFrame(HumanoidRootPart.Position).mul(CFrame.Angles(0, y, 0)),
		math.clamp(deltaTime * 2 * Config.CHARACTER_ROTATION_SPEED, 0, 1),
	);
}

Butler.Connect(Attributes.AttributeChanged, (attribute) => AttributeChanged(attribute));
Butler.Connect(RunService.RenderStepped, (deltaTime) => RenderStepped(deltaTime));
