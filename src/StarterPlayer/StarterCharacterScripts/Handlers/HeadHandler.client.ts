// Imports
import { Players, RunService, Workspace } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const headHorFactor = 1;
const headVerFactor = 0.6;
const bodyHorFactor = 0.5;
const bodyVerFactor = 0.4;

const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;
const Model = Character.Model;

const Head = Model.WaitForChild("Head") as BasePart;
const Torso = Model.WaitForChild("UpperTorso") as BasePart;
const Neck = Head.WaitForChild("Neck") as AnimationConstraint;
const Waist = Torso.WaitForChild("Waist") as AnimationConstraint;

const NeckJointCFrame = Neck.Attachment0!.CFrame;
const WaistJointCFrame = Waist.Attachment0!.CFrame;

const ROTATE_SPEED = 8.5;

function HeadMovement(dt: number) {
	if (!Torso || !Head || !Neck || !Waist || Camera.CameraSubject !== Humanoid) return;

	const camCF = Camera.CFrame;
	const headCF = Head.CFrame;
	const torsoCF = Torso.CFrame;

	// Diferencias de orientación
	const camLook = camCF.LookVector;
	const torsoLook = torsoCF.LookVector;

	// Calcular ángulos relativos
	const horizontalAngle = math.atan2(camLook.X, camLook.Z) - math.atan2(torsoLook.X, torsoLook.Z);
	const verticalAngle = math.asin(camLook.Y);

	// Aplicar interpolación
	const NewNeckRotation = Neck.Attachment0!.CFrame.Lerp(
		NeckJointCFrame.mul(CFrame.Angles(verticalAngle, horizontalAngle, 0)),
		math.min(dt * ROTATE_SPEED, 1),
	);

	const NewWaistRotation = Waist.Attachment0!.CFrame.Lerp(
		WaistJointCFrame.mul(CFrame.Angles(verticalAngle, horizontalAngle, 0)),
		math.min(dt * ROTATE_SPEED, 1),
	);

	// Aplicar nuevas rotaciones
	if (NewNeckRotation !== Neck.Attachment0!.CFrame) Neck.Attachment0!.CFrame = NewNeckRotation;
	if (NewWaistRotation !== Waist.Attachment0!.CFrame) Waist.Attachment0!.CFrame = NewWaistRotation;
}

Butler.Connect(RunService.RenderStepped, (dt) => HeadMovement(dt));
