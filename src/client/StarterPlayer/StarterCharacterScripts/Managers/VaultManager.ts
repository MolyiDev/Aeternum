// Imports
import { Players, RunService, Workspace } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";

// States
const IncludeStates = new Set<EMovementState>([
	EMovementState.Falling,
	EMovementState.Jumping,
	EMovementState.Walking,
	EMovementState.Running,
]);
const ExcludeStates = new Set<EMovementState>([]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;
const Model = Character.Model;
const HeadPart = Model.WaitForChild("HeadPart") as BasePart;
let Vaulting = false;

export class VaultManager {
	public static Init() {
		// Init
	}
}

const RayParams = new RaycastParams();
RayParams.FilterType = Enum.RaycastFilterType.Exclude;
RayParams.FilterDescendantsInstances = [Model];

function RenderStepped() {
	if (Vaulting || !IncludeStates.has(StateManager.State)) return;
	const VaultCastHead = Workspace.Raycast(
		HeadPart.CFrame.Position.add(new Vector3(0, -0.5, -0.5)),
		HumanoidRootPart.CFrame.LookVector,
		RayParams,
	);
	const VaultCastRoot = Workspace.Raycast(
		HumanoidRootPart.CFrame.Position,
		HumanoidRootPart.CFrame.LookVector,
		RayParams,
	);

	if (VaultCastHead) return;
	if (!VaultCastRoot) return;

	print(2);
	Vaulting = true;
	Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);

	const forwardImpulse = HumanoidRootPart.CFrame.LookVector.mul(4);
	const upwardImpulse = HumanoidRootPart.CFrame.UpVector.mul(4);
	const direction = forwardImpulse.add(upwardImpulse);

	HumanoidRootPart.AssemblyLinearVelocity = direction.mul(10);
	task.wait(0.55);
	Vaulting = false;
	Humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, true);
}

Butler.Connect(RunService.RenderStepped, () => RenderStepped());
