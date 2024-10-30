// Imports
import { Players, RunService, Workspace } from "@rbxts/services";
import RaycastHitbox, { HitboxObject } from "@rbxts/raycast-hitbox";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { RunManager } from "./RunManager";
import { Tools } from "shared/Libraries/Tools";
import { ControlManager } from "./ControlsManager";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAnimations } from "shared/Enums/EAnimations";

// Constants
const RAY_DIRECTION = Vector3.yAxis.mul(4).mul(-1);
const SLIDE_ACCELERATION = 20;
const SLIDE_DEACCELERATION = 0.985;
const AIR_TIME_BEFORE_SLIDE_STOP = 0.65;
const TURN_SENSITIVITY = 1.5;
const SLIDE_COOLDOWN = 0.4;
const JUMP_SLIDE_SPEED = 65;
const JUMP_SLIDE_UP = 40;

// Variables
const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera as Camera;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;
const Model = Character.Model;

const RightLeg = Model.WaitForChild("RightLowerLeg") as BasePart;
const LeftLeg = Model.WaitForChild("LeftLowerLeg") as BasePart;
const LowerTorso = Model.WaitForChild("LowerTorso") as BasePart;
const UpperTorso = Model.WaitForChild("UpperTorso") as BasePart;
const Head = Model.WaitForChild("Head") as BasePart;

const [SlideIdle, SlideJump] = Animations.GetAnimations(EAnimations.SlideIdle, EAnimations.SlideJump);

const RayParams = new RaycastParams();
RayParams.FilterDescendantsInstances = [Model];
RayParams.FilterType = Enum.RaycastFilterType.Exclude;
RayParams.IgnoreWater = true;

const SlideAttachment = new Instance("Attachment", HumanoidRootPart);
SlideAttachment.Name = "SlideAttachment";

const AlignOrientation = new Instance("AlignOrientation", HumanoidRootPart);
AlignOrientation.Enabled = false;
AlignOrientation.Responsiveness = 35;
AlignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
AlignOrientation.Attachment0 = SlideAttachment;

const AlignPosition = new Instance("AlignPosition");
AlignPosition.Attachment0 = SlideAttachment;

function ProjectOnPlane(vector: Vector3, planeNormal: Vector3) {
	const sqrMag = planeNormal.Dot(planeNormal);

	if (sqrMag < 1e-5) return vector;
	return vector.sub(planeNormal.mul(vector.Dot(planeNormal) / sqrMag));
}

let PostMovementEvent: RBXScriptConnection | undefined;
let UngroundedConnection: RBXScriptConnection | undefined;
let SlideHitbox: HitboxObject;

let timeSinceUngrounded = 0;
let IsGrounded = true;
let IsSliding = false;
let CanSlide = true;
let CanImpulse = false;
let Landed = false;
let Jumped = false;

export class SlideManager {
	public static OnHitNothing() {
		IsGrounded = false;
		timeSinceUngrounded = 0;

		if (UngroundedConnection) {
			Butler.Remove(UngroundedConnection);
			UngroundedConnection = undefined;
		}

		UngroundedConnection = Butler.Connect(RunService.Heartbeat, (dt) => {
			timeSinceUngrounded += dt;

			if (IsGrounded) {
				UngroundedConnection?.Disconnect();
				UngroundedConnection = undefined;
				return;
			}

			if (timeSinceUngrounded >= AIR_TIME_BEFORE_SLIDE_STOP) {
				if (!IsGrounded) this.SlideStop();

				UngroundedConnection?.Disconnect();
				UngroundedConnection = undefined;
			}
		});
	}

	public static SlideStart() {
		if (IsSliding || !CanSlide || !Tools.IsTouchingGround(Humanoid) || Attributes.IsStunned()) return;

		let timeSinceSlideStart = 0;

		let rayResult = Workspace.Raycast(RightLeg.Position, RAY_DIRECTION, RayParams);
		if (!rayResult) rayResult = Workspace.Raycast(LeftLeg.Position, RAY_DIRECTION, RayParams);
		if (!rayResult) return;

		let floorNormal = rayResult.Normal;
		const slopeVec = ProjectOnPlane(HumanoidRootPart.CFrame.LookVector, floorNormal);

		if (slopeVec.Y > 0.05) return;

		Landed = false;
		CanSlide = false;
		CanImpulse = false;
		IsSliding = true;
		Jumped = false;
		StateManager.SetState(EMovementState.Sliding, true, 0.05);
		SlideIdle.Play(0.3);
		delay(0.25, () => (CanImpulse = true));
		RunManager.RunPause();

		HumanoidRootPart.CanCollide = false;
		UpperTorso.CanCollide = false;
		Head.CanCollide = false;
		AlignOrientation.Enabled = true;
		Attributes.SetAutoRotate(false);
		Humanoid.ChangeState(Enum.HumanoidStateType.Physics);
		HumanoidRootPart.AssemblyLinearVelocity = HumanoidRootPart.AssemblyLinearVelocity.mul(0.85);
		HumanoidRootPart.ApplyImpulse(slopeVec.Unit.mul(HumanoidRootPart.AssemblyMass).mul(SLIDE_ACCELERATION));

		PostMovementEvent = Butler.Connect(RunService.Heartbeat, (dt) => {
			timeSinceSlideStart += dt;

			const slideDirection = Attributes.IsCameraLocked()
				? ProjectOnPlane(Camera.CFrame.LookVector, floorNormal).Unit
				: ProjectOnPlane(HumanoidRootPart.CFrame.LookVector, floorNormal).Unit;

			if (IsGrounded) {
				const LinearVelocity = ProjectOnPlane(HumanoidRootPart.AssemblyLinearVelocity, floorNormal);
				const targetVelocity = slideDirection.mul(LinearVelocity.Magnitude);
				const smoothedVelocity = LinearVelocity.Lerp(targetVelocity, TURN_SENSITIVITY * dt);
				HumanoidRootPart.AssemblyLinearVelocity = smoothedVelocity.mul(SLIDE_DEACCELERATION);
			}

			AlignOrientation.CFrame = CFrame.lookAt(Vector3.zero, HumanoidRootPart.AssemblyLinearVelocity);

			if (timeSinceSlideStart >= 0.1) {
				const rayResult = Workspace.Raycast(
					LowerTorso.Position.add(LowerTorso.CFrame.UpVector.mul(-1)),
					LowerTorso.CFrame.LookVector.mul(3).mul(-1),
					RayParams,
				);

				if (rayResult) {
					IsGrounded = true;
					floorNormal = rayResult.Normal;
				} else if (IsGrounded && !UngroundedConnection) this.OnHitNothing();
			}

			if (
				timeSinceSlideStart >= 0.2 &&
				HumanoidRootPart.AssemblyLinearVelocity.Magnitude < EMovementSpeeds.Default
			)
				this.SlideStop(false, true);
		});

		SlideHitbox = new RaycastHitbox(Model);
		SlideHitbox.DetectionMode = RaycastHitbox.DetectionMode.PartMode;
		SlideHitbox.RaycastParams = RayParams;
		SlideHitbox.Visualizer = false;

		Butler.Add(
			SlideHitbox.OnHit.Connect((hitPart, _, raycastResult) => {
				SlideHitbox.HitStart();
				const slopeVec = ProjectOnPlane(HumanoidRootPart.AssemblyLinearVelocity, raycastResult.Normal);
				if (slopeVec.Y > 0.2) this.SlideStop();

				if (!IsGrounded || floorNormal.Dot(raycastResult.Normal) < 0.97)
					AlignPosition.Position = AlignPosition.Position.add(new Vector3(0, 3, 0));

				floorNormal = raycastResult.Normal;
			}),
			"Disconnect",
		);

		SlideHitbox.HitStart();
	}

	public static SlideStop(partial: boolean = false, resetSpeed: boolean = false) {
		if (!IsSliding) return;
		delay(SLIDE_COOLDOWN, () => (CanSlide = true));
		IsSliding = false;
		AlignOrientation.Enabled = false;
		HumanoidRootPart.CanCollide = true;
		UpperTorso.CanCollide = true;
		Head.CanCollide = true;
		Humanoid.ChangeState(Enum.HumanoidStateType.Running);
		StateManager.SetState(EMovementState.Sliding, false);

		if (!partial) {
			Attributes.SetAutoRotate(true);
			RunManager.RunResume();
		}
		SlideHitbox.Destroy();

		if (PostMovementEvent) {
			Butler.Remove(PostMovementEvent);
			PostMovementEvent = undefined;
		}
		SlideIdle.Stop(0.25);
	}

	public static SlideJump() {
		if (!Tools.IsTouchingGround(Humanoid) || !CanImpulse) return;
		Jumped = true;
		StateManager.SetState(EMovementState.SlidingJump, true);
		this.SlideStop(true);
		SlideJump.Play(0.15, 1, 1.5);

		const forwardImpulse = HumanoidRootPart.CFrame.LookVector.mul(JUMP_SLIDE_SPEED * HumanoidRootPart.AssemblyMass);
		const upwardImpulse = new Vector3(0, JUMP_SLIDE_UP * HumanoidRootPart.AssemblyMass, 0);

		HumanoidRootPart.ApplyImpulse(forwardImpulse.add(upwardImpulse));
		Attributes.SetAutoRotate(true);
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	if (newState !== Enum.HumanoidStateType.Landed) return;
	if (ControlManager.IsKeyDown(ESettingsControls.Crouch) && ControlManager.IsKeyDown(ESettingsControls.Sprint)) {
		if (StateManager.IsInState(EMovementState.SlidingJump)) {
			StateManager.SetState(EMovementState.Sliding, true);
			StateManager.SetState(EMovementState.SlidingJump, false);
			SlideJump.Stop(0.15);
		}

		SlideManager.SlideStart();
		return;
	}
	if (Landed || !StateManager.IsInState(EMovementState.SlidingJump)) return;
	Landed = true;
	StateManager.SetState(EMovementState.SlidingJump, false);
	SlideJump.Stop(0.15);
	RunManager.RunResume();
}

Butler.Connect(Humanoid.StateChanged, (oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
	StateChanged(oldState, newState),
);
Butler.Connect(SlideJump.GetMarkerReachedSignal("End"), () => SlideJump.Stop(0.15));
