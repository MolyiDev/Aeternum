/*import { Players, RunService, Workspace } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Butler = Character.Butler;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const ControllerManager = Character.Model.WaitForChild("ControllerManager") as ControllerManager;
const ControllerPartSensor = ControllerManager.WaitForChild("ControllerPartSensor") as ControllerPartSensor;
const GroundController = ControllerManager.WaitForChild("GroundController") as GroundController;
const AirController = ControllerManager.WaitForChild("AirController") as AirController;
const RayParams = new RaycastParams();
RayParams.FilterDescendantsInstances = [Character.Model];
RayParams.FilterType = Enum.RaycastFilterType.Exclude;

function UpdateMovementDirection() {
	const desiredDirection = Humanoid.MoveDirection;
	ControllerManager.MovingDirection = desiredDirection;
	if (desiredDirection.Magnitude > 0) ControllerManager.FacingDirection = desiredDirection;
	else ControllerManager.FacingDirection = ControllerManager.RootPart!.CFrame.LookVector;
}

function UpdateSensor() {
	const rayGround = Workspace.Raycast(HumanoidRootPart.Position, new Vector3(0, -4.5, 0), RayParams);

	if (rayGround) {
		ControllerPartSensor.SensedPart = rayGround.Instance;
		ControllerPartSensor.HitNormal = rayGround.Normal;
		ControllerPartSensor.HitFrame = new CFrame(rayGround.Position);

		ControllerManager.ActiveController = GroundController;
		//Humanoid.ChangeState(Enum.HumanoidStateType.Running);
	} else {
		ControllerManager.ActiveController = AirController;
		//Humanoid.ChangeState(Enum.HumanoidStateType.Freefall);
	}
}

function UpdateControllers() {
	UpdateMovementDirection();
	UpdateSensor();
}

Butler.Connect(RunService.RenderStepped, UpdateControllers);*/
