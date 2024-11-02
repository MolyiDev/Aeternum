/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players, RunService, Workspace } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// Variables
const TemporalFolder = Workspace.WaitForChild("Temporal") as Folder;
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;
const HumanoidRootAttachment = HumanoidRootPart.WaitForChild("RootAttachment") as Attachment;

const AlignOrientationAttachment = HumanoidRootAttachment.Clone();
AlignOrientationAttachment.Parent = HumanoidRootPart;

const AlignOrientation = new Instance("AlignOrientation", HumanoidRootPart);
AlignOrientation.Enabled = false;
AlignOrientation.MaxTorque = math.huge;
AlignOrientation.Attachment0 = AlignOrientationAttachment;
AlignOrientation.Responsiveness = 40;

const AlignPositionAttachment = HumanoidRootAttachment.Clone();
AlignPositionAttachment.Parent = HumanoidRootPart;

const AlignPosition = new Instance("AlignPosition", HumanoidRootPart);
AlignPosition.Enabled = false;
AlignPosition.MaxForce = math.huge;
AlignPosition.Attachment0 = AlignOrientationAttachment;
AlignPosition.Responsiveness = 40;

const RayParams = new RaycastParams();
RayParams.FilterType = Enum.RaycastFilterType.Exclude;
RayParams.FilterDescendantsInstances = [Character.Model];

const [
	ClimbMoveUp,
	ClimbMoveDown,
	ClimbMoveLeft,
	ClimbMoveRight,
	ClimbImpulseUp,
	ClimbImpulseBack,
	ClimbImpulseLeft,
	ClimbImpulseRight,
	ClimbIdle,
] = Animations.GetAnimations(
	EAnimations.ClimbMoveUp,
	EAnimations.ClimbMoveDown,
	EAnimations.ClimbMoveLeft,
	EAnimations.ClimbMoveRight,
	EAnimations.ClimbImpulseUp,
	EAnimations.ClimbImpulseDown,
	EAnimations.ClimbImpulseLeft,
	EAnimations.ClimbImpulseRight,
	EAnimations.ClimbIdle,
);

const CLIMB_SPEED = 0.35;
const DISTANCE_FROM_SURFACE = 1.2;
const LEDGE_CHECK_DISTANCE = 5;
const FADE_IN = 0.2;
const FADE_OUT = 0.2;

let AlignPart: BasePart;
let IsClimbing = false;
let Impulsed = false;
let climbImpulse = Vector3.zero;
let climbHeartbeatConnection: RBXScriptConnection | undefined;

export class ClimbManager {
	public static ClimbDirection = Vector3.zero;

	public static StopMovements(fading: number) {
		ClimbMoveUp.Stop(fading);
		ClimbMoveDown.Stop(fading);
		ClimbMoveLeft.Stop(fading);
		ClimbMoveRight.Stop(fading);
	}

	public static StopImpulses(fading: number | undefined) {
		ClimbImpulseUp.Stop(fading);
		ClimbImpulseBack.Stop(fading);
		ClimbImpulseLeft.Stop(fading);
		ClimbImpulseRight.Stop(fading);
	}

	public static StartClimbing(rayResult: RaycastResult) {
		if (IsClimbing) return;
		const hitCharacter = rayResult.Instance.Parent as IModel;
		const hitHumanoid = hitCharacter?.FindFirstChild("Humanoid");
		if (hitHumanoid) return;

		this.ClimbDirection = Vector3.zero;
		IsClimbing = true;
		Impulsed = false;

		AlignPart = new Instance("Part", TemporalFolder);
		AlignPart.Size = Vector3.one;
		AlignPart.Anchored = true;
		AlignPart.Transparency = 1;
		AlignPart.Massless = true;
		AlignPart.CanCollide = false;
		AlignPart.CanTouch = false;
		AlignPart.CanQuery = false;

		AlignOrientation.Attachment1 = new Instance("Attachment", AlignPart);
		AlignPosition.Attachment1 = new Instance("Attachment", AlignPart);

		const targetCFrame = CFrame.fromMatrix(
			rayResult.Position.add(
				HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection.mul(CLIMB_SPEED)),
			).add(rayResult.Normal.mul(DISTANCE_FROM_SURFACE)),
			rayResult.Normal.Cross(HumanoidRootPart.CFrame.UpVector).mul(-1),
			rayResult.Normal.Cross(HumanoidRootPart.CFrame.RightVector),
		);

		AlignPart.CFrame = targetCFrame;

		AlignPosition.Enabled = true;
		AlignOrientation.Enabled = true;
		Attributes.SetAutoRotate(false);

		Humanoid.PlatformStand = true;
		StateManager.SetState(EMovementState.Climbing, true, FADE_OUT);
		this.StopMovements(FADE_OUT);
		this.StopImpulses(FADE_OUT);

		ClimbIdle.Play(FADE_IN);

		climbHeartbeatConnection = Butler.Connect(RunService.Heartbeat, () => {
			if (!IsClimbing || this.ClimbDirection === Vector3.zero) return;

			const resultMiddle = this.DetectWall(
				HumanoidRootPart.CFrame.add(HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection)),
			);

			if (!resultMiddle) {
				if (ControlManager.IsKeyDown(ESettingsControls.Sprint)) this.ClimbImpulse();
				return;
			}

			const targetCFrame = CFrame.fromMatrix(
				resultMiddle.Position.add(
					HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection.mul(CLIMB_SPEED)),
				).add(resultMiddle.Normal.mul(DISTANCE_FROM_SURFACE)),
				resultMiddle.Normal.Cross(HumanoidRootPart.CFrame.UpVector).mul(-1),
				resultMiddle.Normal.Cross(HumanoidRootPart.CFrame.RightVector),
			);

			AlignPart.CFrame = targetCFrame;
		});
	}

	public static StopClimbing(full: boolean = false) {
		if (!IsClimbing) return;
		IsClimbing = false;
		this.ClimbDirection = Vector3.zero;
		if (climbHeartbeatConnection) {
			Butler.Remove(climbHeartbeatConnection);
			climbHeartbeatConnection = undefined;
		}

		ClimbIdle.Stop(FADE_OUT);
		this.StopMovements(FADE_OUT);

		if (!full) return;
		Attributes.SetAutoRotate(true);
		StateManager.SetState(EMovementState.Climbing, false);
		AlignPosition.Enabled = false;
		AlignOrientation.Enabled = false;
		Humanoid.PlatformStand = false;
		AlignPart?.Destroy();
		Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
	}

	public static ClimbImpulse() {
		climbImpulse = this.ClimbDirection;
		this.StopClimbing();

		if (climbImpulse.X === 1) ClimbImpulseRight.Play(0.2);
		else if (climbImpulse.X === -1) ClimbImpulseLeft.Play(0.2);

		if (climbImpulse.Y === 1) ClimbImpulseUp.Play(0.2);
		else if (climbImpulse.Y === -1) ClimbImpulseBack.Play(0.2);
	}

	public static DetectWall(cf: CFrame) {
		const rayResult = Workspace.Raycast(cf.Position, cf.LookVector.mul(LEDGE_CHECK_DISTANCE), RayParams);

		if (rayResult && rayResult.Instance.Size.Magnitude > 2) return rayResult;
		return undefined;
	}

	public static CheckZero() {
		if (!IsClimbing) return;

		if (this.ClimbDirection === Vector3.zero) {
			this.StopMovements(FADE_OUT);
			return;
		}
		switch (this.ClimbDirection.Y) {
			case 1:
				if (!ClimbMoveUp.IsPlaying) ClimbMoveUp.Play(FADE_IN);
				if (ClimbMoveDown.IsPlaying) ClimbMoveDown.Stop(FADE_OUT);
				break;
			case -1:
				if (!ClimbMoveDown.IsPlaying) ClimbMoveDown.Play(FADE_IN, 1, -1);
				if (ClimbMoveUp.IsPlaying) ClimbMoveUp.Stop(FADE_OUT);
				break;
			default:
				if (ClimbMoveUp.IsPlaying) ClimbMoveUp.Stop(FADE_OUT);
				if (ClimbMoveDown.IsPlaying) ClimbMoveDown.Stop(FADE_OUT);
				break;
		}

		switch (this.ClimbDirection.X) {
			case 1:
				if (!ClimbMoveRight.IsPlaying) ClimbMoveRight.Play(FADE_IN);
				if (ClimbMoveLeft.IsPlaying) ClimbMoveLeft.Stop(FADE_OUT);
				break;
			case -1:
				if (!ClimbMoveLeft.IsPlaying) ClimbMoveLeft.Play(FADE_IN, 1, -1);
				if (ClimbMoveRight.IsPlaying) ClimbMoveRight.Stop(FADE_OUT);
				break;
			default:
				if (ClimbMoveLeft.IsPlaying) ClimbMoveLeft.Stop(FADE_OUT);
				if (ClimbMoveRight.IsPlaying) ClimbMoveRight.Stop(FADE_OUT);
				break;
		}
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	if (newState === Enum.HumanoidStateType.Landed) ClimbManager.StopMovements(0.1);
}

Butler.Connect(Humanoid.StateChanged, (oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
	StateChanged(oldState, newState),
);

function Impulse() {
	if (Impulsed) return;
	Impulsed = true;

	Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
	StateManager.SetState(EMovementState.Climbing, false);
	AlignPart?.Destroy();
	Attributes.SetAutoRotate(true);
	AlignPosition.Enabled = false;
	AlignOrientation.Enabled = false;
	if (climbImpulse.Y === 0) climbImpulse = climbImpulse.add(new Vector3(0, 0.65, 0));
	const forwardImpulse = HumanoidRootPart.CFrame.RightVector.mul(climbImpulse.X);
	const sidewaysImpulse = HumanoidRootPart.CFrame.RightVector.mul(climbImpulse.Z);
	const upwardImpulse = HumanoidRootPart.CFrame.UpVector.mul(math.abs(climbImpulse.Y));
	const backwardImpulse =
		climbImpulse.Y === -1 ? HumanoidRootPart.CFrame.LookVector.mul(climbImpulse.Y) : Vector3.zero;

	const direction = forwardImpulse.add(sidewaysImpulse).add(upwardImpulse).add(backwardImpulse);
	HumanoidRootPart.AssemblyLinearVelocity = direction.mul(75);
	Humanoid.PlatformStand = false;
}

Butler.Connect(ClimbImpulseUp.GetMarkerReachedSignal("Impulse"), () => Impulse());
Butler.Connect(ClimbImpulseLeft.GetMarkerReachedSignal("Impulse"), () => Impulse());
Butler.Connect(ClimbImpulseRight.GetMarkerReachedSignal("Impulse"), () => Impulse());
Butler.Connect(ClimbImpulseBack.GetMarkerReachedSignal("Impulse"), () => Impulse());

Butler.Connect(ClimbImpulseUp.GetMarkerReachedSignal("End"), () => ClimbImpulseUp.Stop(0.125));
Butler.Connect(ClimbImpulseLeft.GetMarkerReachedSignal("End"), () => ClimbImpulseLeft.Stop(0.125));
Butler.Connect(ClimbImpulseRight.GetMarkerReachedSignal("End"), () => ClimbImpulseRight.Stop(0.125));
Butler.Connect(ClimbImpulseBack.GetMarkerReachedSignal("End"), () => ClimbImpulseBack.Stop(0.125));
