// Imports
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAttribute } from "shared/Enums/EAttribute";

// Events
const UpdateHead = ReplicatedStorage.WaitForChild("Events").WaitForChild("UpdateHead") as UnreliableRemoteEvent;

// Variables
const headHorFactor = 1;
const headVerFactor = 0.6;
const bodyHorFactor = 0.5;
const bodyVerFactor = 0.4;

const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Janitor = Character.Janitor;
const Model = Character.Model;

const Head = Model.WaitForChild("Head") as BasePart;
const Torso = Model.WaitForChild("UpperTorso") as BasePart;
const Neck = Head.WaitForChild("Neck") as Motor6D;
const Waist = Torso.WaitForChild("Waist") as Motor6D;

const NeckC0 = Neck.C0;
const WaistC0 = Waist.C0;

Neck.MaxVelocity = 1 / 3;

function HeadMovement() {
	if (!Torso || !Head || !Neck || !Waist || Camera.CameraSubject !== Humanoid) return;
	if (Attributes.IsCameraLocked()) return;
	const camCF = Camera.CFrame;
	const headCF = Head.CFrame;

	const torsoLV = Torso.CFrame.LookVector;

	const dist = headCF.Position.sub(camCF.Position).Magnitude;
	const diff = headCF.Position.Y - camCF.Position.Y;

	const asinDiffDist = math.asin(diff / dist);
	const whateverThisDoes = headCF.Position.sub(camCF.Position).Unit.Cross(torsoLV).Y;

	const newNeckC0 = NeckC0.mul(CFrame.Angles(asinDiffDist * headVerFactor, -1 * whateverThisDoes * headHorFactor, 0));
	const newWaistC0 = WaistC0.mul(
		CFrame.Angles(asinDiffDist * bodyVerFactor, -1 * whateverThisDoes * bodyHorFactor, 0),
	);

	UpdateHead.FireServer(newNeckC0, newWaistC0);
}

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsCameraLocked || !Attributes.IsCameraLocked()) return;
	UpdateHead.FireServer(NeckC0, WaistC0);
}

Janitor.Add(RunService.RenderStepped.Connect(() => HeadMovement()));
Janitor.Add(Attributes.AttributeChanged.Connect((attribute) => AttributeChanged(attribute)));
