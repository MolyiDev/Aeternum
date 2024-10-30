// Imports
import { Debris, Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { Tools } from "shared/Libraries/Tools";
import { StateManager } from "./Managers/StateManager";
import { CrouchManager } from "./Managers/CrouchManager";
import { RunManager } from "./Managers/RunManager";
import { WalkManager } from "./Managers/WalkManager";
import { ClimbManager } from "./Managers/ClimbManager";
import { DashManager } from "./Managers/DashManager";
import { ControlManager } from "./Managers/ControlsManager";
import { IdleManager } from "./Managers/IdleManager";
import { JumpManager } from "./Managers/JumpManager";
import { LandManager } from "./Managers/LandManager";
import { FallManager } from "./Managers/FallManager";
import { VaultManager } from "./Managers/VaultManager";
import { GuardManager } from "./Combat/Managers/GuardManager";
import { SlideManager } from "./Managers/SlideManager";
import { ShiftLockHandler } from "./Handlers/ShiftLockHandler";
import { CharacterManager } from "../../../shared/Managers/CharacterManager";

// Variables
const TemporalFolder = Workspace.WaitForChild("Temporal");
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;
const Model = Character.Model;

const Dust = ReplicatedStorage.WaitForChild("Effects").WaitForChild("Dust") as BasePart;

//VaultManager.Init();

Humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Forward:
			if (StateManager.IsInState(EMovementState.Climbing)) {
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(0, 1, 0));
				if (doublePressed && StateManager.IsInState(EMovementState.Climbing)) ClimbManager.ClimbImpulse();
			}
			break;
		case ESettingsControls.Back:
			if (StateManager.IsInState(EMovementState.Climbing)) {
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(0, -1, 0));
				if (doublePressed && StateManager.IsInState(EMovementState.Climbing)) ClimbManager.ClimbImpulse();
			}
			break;
		case ESettingsControls.Left:
			if (StateManager.IsInState(EMovementState.Climbing)) {
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(-1, 0, 0));
				if (doublePressed && StateManager.IsInState(EMovementState.Climbing)) ClimbManager.ClimbImpulse();
			}
			break;
		case ESettingsControls.Right:
			if (StateManager.IsInState(EMovementState.Climbing)) {
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(1, 0, 0));
				if (doublePressed && StateManager.IsInState(EMovementState.Climbing)) ClimbManager.ClimbImpulse();
			}
			break;
		case ESettingsControls.Crouch:
			if (!StateManager.IsInState(EMovementState.Sliding) && !Attributes.IsStunned()) {
				if (StateManager.IsInState(EMovementState.Running) && StateManager.IsMoving()) {
					SlideManager.SlideStart();
				} else if (StateManager.IsInState(EMovementState.Crouching)) CrouchManager.CrouchStop();
				else CrouchManager.CrouchStart();
			}
			break;
		case ESettingsControls.Sprint:
			if (!Attributes.IsStunned()) RunManager.RunStart();
			break;
		case ESettingsControls.Dash:
			if (!Attributes.IsStunned()) DashManager.DashStart();
			break;
		case ESettingsControls.Jump:
			if (StateManager.IsInState(EMovementState.Crouching)) CrouchManager.CrouchStop();
			else if (
				StateManager.IsInState(EMovementState.Sliding) &&
				!StateManager.IsInState(EMovementState.SlidingJump)
			)
				SlideManager.SlideJump();
			else if (StateManager.IsInState(EMovementState.Climbing)) ClimbManager.StopClimbing(true);
			else JumpManager.DoubleJumpStart();
			break;
		case ESettingsControls.Climb:
			if (!Attributes.IsStunned()) {
				if (StateManager.IsInState(EMovementState.Climbing)) ClimbManager.StopClimbing(true);
				else {
					const rayRes = ClimbManager.DetectWall(HumanoidRootPart.CFrame);
					if (rayRes) {
						ClimbManager.StartClimbing(rayRes);
						if (ControlManager.IsKeyDown(ESettingsControls.Forward))
							ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(0, 1, 0));
						if (ControlManager.IsKeyDown(ESettingsControls.Back))
							ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(0, -1, 0));
						if (ControlManager.IsKeyDown(ESettingsControls.Left))
							ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(-1, 0, 0));
						if (ControlManager.IsKeyDown(ESettingsControls.Right))
							ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.add(new Vector3(1, 0, 0));
					}
				}
			}
			break;
		case ESettingsControls.LockCamera:
			ShiftLockHandler.Toggle();
			break;
	}

	ClimbManager.CheckZero();
}

function InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
	if (!control) return;

	switch (control[0]) {
		case ESettingsControls.Forward:
			if (StateManager.IsInState(EMovementState.Climbing))
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.sub(new Vector3(0, 1, 0));
			break;
		case ESettingsControls.Back:
			if (StateManager.IsInState(EMovementState.Climbing))
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.sub(new Vector3(0, -1, 0));
			break;
		case ESettingsControls.Left:
			if (StateManager.IsInState(EMovementState.Climbing))
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.sub(new Vector3(-1, 0, 0));
			break;
		case ESettingsControls.Right:
			if (StateManager.IsInState(EMovementState.Climbing))
				ClimbManager.ClimbDirection = ClimbManager.ClimbDirection.sub(new Vector3(1, 0, 0));
			break;
		case ESettingsControls.Crouch:
			if (StateManager.IsInState(EMovementState.Sliding)) SlideManager.SlideStop();
			break;
		case ESettingsControls.Sprint:
			RunManager.RunStop();
			break;
	}

	ClimbManager.CheckZero();
}

function StateChanged(oldState: EMovementState, newState: EMovementState, speed: number | undefined) {
	switch (newState) {
		case EMovementState.Climbing:
			GuardManager.Stop();
			IdleManager.IdleDeactivate();
			JumpManager.JumpDeactivate(speed);
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			RunManager.RunDeactivate();
			break;
		case EMovementState.Walking:
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkActivate();
			RunManager.RunDeactivate();
			break;
		case EMovementState.Idle:
			GuardManager.Stop();
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			IdleManager.IdleActivate();
			RunManager.RunDeactivate();
			break;
		case EMovementState.Falling:
			GuardManager.Stop();
			IdleManager.IdleDeactivate();
			FallManager.FallingActivate();
			WalkManager.WalkDeactivate(speed);
			ClimbManager.StopImpulses(speed);
			RunManager.RunPause();
			break;
		case EMovementState.Running:
			GuardManager.Stop();
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			RunManager.RunActivate();
			break;
		case EMovementState.SlidingJump:
		case EMovementState.Sliding:
			GuardManager.Stop();
			LandManager.LandDeactivate(speed);
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			IdleManager.IdleDeactivate();
			RunManager.RunPause();
			break;
		case EMovementState.Jumping:
			GuardManager.Stop();
			JumpManager.JumpActivate();
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			RunManager.RunPause();
			break;
		case EMovementState.Landing:
			GuardManager.Stop();
			JumpManager.JumpDeactivate(speed);
			FallManager.FallingDeactivate(speed);
			if (
				!StateManager.IsInState(EMovementState.SlidingJump) &&
				!StateManager.IsInState(EMovementState.Sliding)
			) {
				StateManager.SetState(EMovementState.Idle, true);
				RunManager.RunResume();
			}
			break;
		case EMovementState.Blocking:
			RunManager.RunDeactivate();
			break;
		case EMovementState.Guarding:
			break;
		default:
			GuardManager.Stop();
			FallManager.FallingDeactivate(speed);
			WalkManager.WalkDeactivate(speed);
			RunManager.RunDeactivate();
			break;
	}
}

let lastRun = tick();
let direction = 1;
let lastPosition = new Vector3(0, 0, 0);
const RayParams = new RaycastParams();
RayParams.FilterDescendantsInstances = [Model];

function Movement() {
	const rootVelocity = HumanoidRootPart.AssemblyLinearVelocity.Magnitude;
	const isMovingFast = rootVelocity > EMovementSpeeds.Default * 1.5;

	if (isMovingFast) {
		const particleCount = math.random(1, 3);
		for (let i = 0; i < particleCount; i++) {
			const speedParticle = new Instance("Part", TemporalFolder);
			speedParticle.Anchored = true;
			speedParticle.CanCollide = false;
			speedParticle.CanQuery = false;
			speedParticle.CanTouch = false;
			speedParticle.Transparency = 0.8;
			speedParticle.Material = Enum.Material.SmoothPlastic;
			speedParticle.Size = new Vector3(0.07, 0.07, math.random(4, 6));

			speedParticle.Color = math.random(1, 3) === 1 ? Color3.fromRGB(86, 86, 86) : Color3.fromRGB(175, 175, 175);

			const directionCFrame = CFrame.lookAt(lastPosition, HumanoidRootPart.Position);
			speedParticle.CFrame = directionCFrame.mul(
				new CFrame(math.random(-20, 20) / 10, math.random(-1, 1), math.random(-1, 1)),
			);

			Debris.AddItem(speedParticle, 0.285);
			Tools.TweenPlay(speedParticle, new TweenInfo(0.285), {
				Transparency: 1,
				Size: new Vector3(0, 0, 0),
				CFrame: speedParticle.CFrame.mul(new CFrame(0, 0, math.random(2, 4))),
			});
		}

		if (tick() - lastRun > 6 / EMovementSpeeds.Run) {
			lastRun = tick();

			const dustClone = Dust.Clone();
			dustClone.Parent = TemporalFolder;
			dustClone.CFrame = HumanoidRootPart.CFrame.mul(new CFrame(direction, -2.5, 0));

			const rayResult = Workspace.Raycast(
				dustClone.Position.add(new Vector3(0, 1, 0)),
				new Vector3(0, -3, 0),
				RayParams,
			);
			if (rayResult) {
				const attachment = dustClone.FindFirstChild("Attachment");
				const dust = attachment?.FindFirstChild("Dust") as ParticleEmitter | undefined;
				if (dust) {
					dust.Color = new ColorSequence([
						new ColorSequenceKeypoint(0, rayResult.Instance.Color),
						new ColorSequenceKeypoint(1, rayResult.Instance.Color),
					]);
					dust.Emit(10);
				}
			}

			Debris.AddItem(dustClone, 1);
			direction = -direction;
		}
	} else direction = 1;

	lastPosition = HumanoidRootPart.Position;
}

Butler.Connect(
	ControlManager.LocalInputBegan,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) => {
		InputBegan(control, input, doublePressed);
	},
);

Butler.Connect(
	ControlManager.LocalInputEnded,
	(control: [string, number] | undefined, input: InputObject | undefined) => {
		InputEnded(control, input);
	},
);

Butler.Connect(
	StateManager.StateChanged,
	(oldState: EMovementState, newState: EMovementState, speed: number | undefined) =>
		StateChanged(oldState, newState, speed),
);

Butler.Connect(RunService.Heartbeat, () => Movement());

IdleManager.Initialize();
