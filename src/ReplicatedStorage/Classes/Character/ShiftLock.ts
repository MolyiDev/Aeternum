import Signal from "@rbxts/lemon-signal";
import { Character } from ".";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsGeneral } from "ReplicatedStorage/Enums/Settings/ESettingsGeneral";
import Spring from "@rbxts/spring";
import { RunService, UserInputService, Workspace } from "@rbxts/services";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";
import { EDecision } from "ReplicatedStorage/Enums/UI/EDecision";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const Config = {
	CHARACTER_ROTATION_SPEED: 5,
	TRANSITION_SPRING_DAMPER: 0.55,
	CAMERA_TRANSITION_IN_SPEED: 10,
	CAMERA_TRANSITION_OUT_SPEED: 10,
	LOCKED_CAMERA_OFFSET_RIGHT: new Vector3(1.75, 0.25, 0),
	LOCKED_CAMERA_OFFSET_LEFT: new Vector3(-1.75, 0.25, 0),
	LOCKED_MOUSE_ICON: "rbxassetid://114468935271559",
};

export class ShiftLock {
	private IsActive: boolean = false;
	private Character: Character;
	private Mouse: Mouse;
	private Camera: Camera = Workspace.CurrentCamera!;
	private Direction: Vector3 = Vector3.zero;
	private AutoRotate: boolean = true;
	private CameraSpring: Spring<Vector3> = new Spring(new Vector3(0, 0, 0));
	public ChangedDirection: Signal<Vector3> = new Signal();
	private Connections: RBXScriptConnection[];

	constructor(character: Character) {
		this.Character = character;
		this.Mouse = this.Character.Player!.GetMouse();

		this.Connections = [
			character.Butler.Connect(character.Attributes.AttributeChanged, (attribute) =>
				this.AttributeChanged(attribute),
			),

			character.Butler.Connect(character.Player!.AttributeChanged, (attribute) =>
				this.SettingAttributeChanged(attribute),
			),

			character.Butler.Connect(RunService.RenderStepped, (dt) => this.RenderStepped(dt)),
		];
	}

	public Destroy() {
		this.Character.Butler.RemoveList(this.Connections);
		this.Connections.clear();

		this.IsActive = undefined!;
		this.Character = undefined!;
		this.Mouse = undefined!;
		this.Camera = undefined!;
		this.Direction = undefined!;
		this.AutoRotate = undefined!;
		this.CameraSpring = undefined!;
		this.ChangedDirection = undefined!;
		this.Connections = undefined!;
	}

	public Toggle() {
		if (this.IsActive) {
			this.CameraSpring.Speed = Config.CAMERA_TRANSITION_OUT_SPEED;
			this.CameraSpring.Target = new Vector3(0, 0, 0);
			this.Disable();
		} else {
			this.CameraSpring.Speed = Config.CAMERA_TRANSITION_IN_SPEED;
			this.CameraSpring.Target =
				SettingsManager.GetSetting(this.Character.Player!, ESettingsGeneral.LockedCamera) === EDecision.Two
					? Config.LOCKED_CAMERA_OFFSET_RIGHT
					: Config.LOCKED_CAMERA_OFFSET_LEFT;
			this.Enable();
		}
	}

	public ChangeLockedDirection() {
		if (!this.IsActive) return;
		this.CameraSpring.Target =
			SettingsManager.GetSetting(this.Character.Player!, ESettingsGeneral.LockedCamera) === EDecision.Two
				? Config.LOCKED_CAMERA_OFFSET_RIGHT
				: Config.LOCKED_CAMERA_OFFSET_LEFT;
	}

	private Enable() {
		if (this.IsActive) return;
		this.IsActive = true;
		this.Character.Humanoid.AutoRotate = false;
		this.Character.Attributes.SetIsCameraLocked(true);
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
		this.Mouse.Icon = Config.LOCKED_MOUSE_ICON;
	}

	private Disable() {
		if (!this.IsActive) return;
		this.IsActive = false;
		this.Character.Humanoid.AutoRotate = true;
		this.Character.Attributes.SetIsCameraLocked(false);
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		this.Mouse.Icon = "";
	}

	public AttributeChanged(attribute: string) {
		if (attribute !== EAttribute.AutoRotate) return;
		this.AutoRotate = this.Character.Attributes.IsAutoRotate();
	}

	public SettingAttributeChanged(attribute: string) {
		if (attribute !== ESettingsGeneral.LockedCamera) return;
		this.ChangeLockedDirection();
	}

	public RenderStepped(dt: number) {
		this.Camera.CFrame = this.Camera.CFrame.mul(new CFrame(this.CameraSpring.Position));

		if (this.AutoRotate && this.IsActive) {
			const [x, y, z] = this.Camera.CFrame.ToOrientation();
			this.Character.HumanoidRootPart.CFrame = this.Character.HumanoidRootPart.CFrame.Lerp(
				new CFrame(this.Character.HumanoidRootPart.Position).mul(CFrame.Angles(0, y, 0)),
				math.clamp(dt * 2 * Config.CHARACTER_ROTATION_SPEED, 0, 1),
			);
		}

		const actualDirection = Tools.WorldMovingDirection(
			this.Character.HumanoidRootPart.CFrame.VectorToObjectSpace(this.Character.Humanoid.MoveDirection),
		);

		if (actualDirection === this.Direction) return;
		this.Direction = actualDirection;
		this.ChangedDirection.Fire(this.Direction);
	}
}
