// Imports
import { Players, RunService } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const MOMENTUM_FACTOR = 0.01;
const MIN_MOMENTUM = 0;
const MAX_MOMENTUM = math.huge;
const SPEED = 16;

const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;
const HumanoidRootPart = Character.HumanoidRootPart;
const Model = Character.Model;
const M6D = Model.WaitForChild("LowerTorso").WaitForChild("Root") as AnimationConstraint;
const OriginalM6DC0 = M6D.Transform;

function Lean(deltaTime: number) {
	if (States.IsInState(EMovementState.Sliding) || States.IsInState(EMovementState.SlidingJump)) return;
	const direction = HumanoidRootPart.CFrame.VectorToObjectSpace(Humanoid.MoveDirection);
	let momentum = HumanoidRootPart.CFrame.VectorToObjectSpace(HumanoidRootPart.AssemblyLinearVelocity).mul(
		MOMENTUM_FACTOR,
	);

	momentum = new Vector3(
		math.clamp(math.abs(momentum.X), MIN_MOMENTUM, MAX_MOMENTUM),
		0,
		math.clamp(math.abs(momentum.Z), MIN_MOMENTUM, MAX_MOMENTUM),
	);

	const x = direction.X * momentum.X;
	const z = direction.X * momentum.Z;

	M6D.Transform = M6D.Transform.Lerp(OriginalM6DC0.mul(CFrame.Angles(-math.abs(z), 0, -x)), deltaTime * SPEED);
}

Butler.Connect(RunService.Heartbeat, (deltaTime) => Lean(deltaTime));
