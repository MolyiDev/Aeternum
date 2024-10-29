// Imports
import { Players, Workspace } from "@rbxts/services";
import { Tools } from "shared/Libraries/Tools";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([]);
const ExcludeStates = new Set<EMovementState>([EMovementState.Sliding]);

// Variables
const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Janitor = Character.Janitor;

const [DashForward, DashBack, DashLeft, DashRight] = AnimManager.GetAnimations(
	Character,
	EAnimations.DashForward,
	EAnimations.DashBack,
	EAnimations.DashLeft,
	EAnimations.DashRight,
);

const DASH_COOLDOWN = 2.5;
const DASH_SPEED = 175;

let CanDash = true;

export class DashManager {
	public static DashStart() {
		if (!CanDash || ExcludeStates.has(StateManager.State)) return;
		CanDash = false;

		const moveDirection = DashManager.GetMoveDirection();

		const dashImpulse = Tools.IsTouchingGround(Humanoid, true)
			? moveDirection.mul(DASH_SPEED * HumanoidRootPart.AssemblyMass)
			: moveDirection.mul((DASH_SPEED / 2.25) * HumanoidRootPart.AssemblyMass);

		HumanoidRootPart.ApplyImpulse(dashImpulse);

		delay(DASH_COOLDOWN, () => {
			CanDash = true;
		});
	}

	private static GetMoveDirection(): Vector3 {
		const cameraLookVector = Camera.CFrame.LookVector;
		const cameraRightVector = Camera.CFrame.RightVector;
		const cameraLocked = Attributes.IsCameraLocked();
		let moveVector = new Vector3(0, 0, 0);

		if (ControlManager.IsKeyDown(ESettingsControls.Forward)) {
			moveVector = moveVector.add(cameraLookVector);
			DashForward.Play(0.1);
		}
		if (ControlManager.IsKeyDown(ESettingsControls.Back)) {
			moveVector = moveVector.sub(cameraLookVector);
			if (!cameraLocked) DashForward.Play(0.1);
			else DashBack.Play(0.1);
		}
		if (ControlManager.IsKeyDown(ESettingsControls.Left)) {
			moveVector = moveVector.sub(cameraRightVector);
			if (!cameraLocked) DashForward.Play(0.1);
			else DashLeft.Play(0.1);
		}
		if (ControlManager.IsKeyDown(ESettingsControls.Right)) {
			moveVector = moveVector.add(cameraRightVector);
			if (!cameraLocked) DashForward.Play(0.1);
			else DashRight.Play(0.1);
		}

		if (moveVector === Vector3.zero) DashBack.Play(0.1);

		moveVector = new Vector3(moveVector.X, 0, moveVector.Z);
		return moveVector.Magnitude > 0
			? moveVector.Unit
			: new Vector3(-HumanoidRootPart.CFrame.LookVector.X, 0, -HumanoidRootPart.CFrame.LookVector.Z);
	}
}

Janitor.Add(DashForward.GetMarkerReachedSignal("End").Connect(() => DashForward.Stop(0.3)));
Janitor.Add(DashBack.GetMarkerReachedSignal("End").Connect(() => DashBack.Stop(0.3)));
Janitor.Add(DashLeft.GetMarkerReachedSignal("End").Connect(() => DashLeft.Stop(0.3)));
Janitor.Add(DashRight.GetMarkerReachedSignal("End").Connect(() => DashRight.Stop(0.3)));
