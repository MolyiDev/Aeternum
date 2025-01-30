// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import RaycastHitbox, { HitboxObject } from "@rbxts/raycast-hitbox";
import { RunService, Workspace } from "@rbxts/services";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EStartType } from "ReplicatedStorage/Enums/Style/EStartType";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EStopType } from "ReplicatedStorage/Enums/Style/EStopType";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Slide}`;

const RAY_DIRECTION = new Vector3(0, -10, 0);
const SLIDE_ACCELERATION = 45;
const SLIDE_DEACCELERATION = 0.99775;
const AIR_TIME_BEFORE_SLIDE_STOP = 0.8;
const TURN_SENSITIVITY = 1.5;
const SLIDE_COOLDOWN = 0.4;
const JUMP_SLIDE_SPEED = 58;
const JUMP_SLIDE_UP = 38;

const Default_Hands_SlideInfo = {
	[EAnimations.Default_Hands_SlideIdle]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_SlideJump]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[Style]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Slide extends CStyle {
	private SlideHitbox: HitboxObject = new RaycastHitbox(this.Model);
	private TimeSinceUngrounded: number = 0;
	private IsGrounded: boolean = true;
	private IsSliding: boolean = false;
	private CanSlide: boolean = true;
	private CanImpulse: boolean = false;
	private Landed: boolean = false;
	private FloorNormal: Vector3 = Vector3.zero;
	private Camera: Camera = Workspace.CurrentCamera!;

	private SlideIdle: AnimationTrack;
	private SlideJump: AnimationTrack;

	private AlignOrientation: AlignOrientation;
	private RayParams: RaycastParams = new RaycastParams();

	private OnHitboxHit: RBXScriptConnection;
	private OnPostMovement: RBXScriptConnection | undefined;
	private OnUngrounded: RBXScriptConnection | undefined;
	private OnStateChanged: RBXScriptConnection;

	constructor(character: Character) {
		super(character);
		[this.SlideIdle, this.SlideJump] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_SlideIdle,
			EAnimations.Default_Hands_SlideJump,
		);

		this.SlideHitbox.DetectionMode = RaycastHitbox.DetectionMode.PartMode;
		this.SlideHitbox.RaycastParams = this.RayParams;
		this.SlideHitbox.Visualizer = false;

		this.OnHitboxHit = this.Butler.Connect(this.SlideHitbox.OnHit, (part, humanoid, rayResult) => {
			const slopeVec = Tools.ProjectOnPlane(this.HumanoidRootPart.AssemblyLinearVelocity, rayResult.Normal);
			if (slopeVec.Y > 0.15) this.Stop();

			this.FloorNormal = rayResult.Normal;
		});

		const RootAttachment = this.HumanoidRootPart.FindFirstChild("RootAttachment") as Attachment;

		const AlignOrientation = new Instance("AlignOrientation", this.HumanoidRootPart);
		AlignOrientation.Enabled = false;
		AlignOrientation.Responsiveness = 35;
		AlignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
		AlignOrientation.Attachment0 = RootAttachment;
		this.AlignOrientation = AlignOrientation;

		this.RayParams.AddToFilter(this.Model);
		this.RayParams.FilterType = Enum.RaycastFilterType.Exclude;

		this.OnStateChanged = this.Butler.Connect(this.Humanoid.StateChanged, (oldState, newState) =>
			this.StateChanged(oldState, newState),
		);
	}

	public Destroy() {
		this.Butler.RemoveList(this.OnHitboxHit, this.OnPostMovement, this.OnUngrounded, this.OnStateChanged);
		this.SlideHitbox.Destroy();
		this.AlignOrientation.Destroy();

		this.TimeSinceUngrounded = undefined!;
		this.IsGrounded = undefined!;
		this.IsSliding = undefined!;
		this.CanSlide = undefined!;
		this.CanImpulse = undefined!;
		this.FloorNormal = undefined!;
		this.Camera = undefined!;
		this.SlideIdle = undefined!;
		this.SlideJump = undefined!;
		this.AlignOrientation = undefined!;
		this.RayParams = undefined!;
		this.OnHitboxHit = undefined!;
		this.OnPostMovement = undefined!;
		this.OnUngrounded = undefined!;
		this.OnStateChanged = undefined!;

		super.Destroy();
	}

	public OnHitNothing() {
		this.IsGrounded = false;
		this.TimeSinceUngrounded = 0;

		if (this.OnUngrounded) {
			this.Butler.Remove(this.OnUngrounded);
			this.OnUngrounded = undefined;
		}

		this.OnUngrounded = this.Butler.Connect(RunService.Heartbeat, (dt) => {
			if (this.IsGrounded) {
				this.OnUngrounded?.Disconnect();
				this.OnUngrounded = undefined;
				return;
			}

			this.TimeSinceUngrounded += dt;

			if (this.TimeSinceUngrounded >= AIR_TIME_BEFORE_SLIDE_STOP) {
				if (!this.IsGrounded) this.Stop();

				this.OnUngrounded?.Disconnect();
				this.OnUngrounded = undefined;
			}
		});
	}

	public Start(StartType?: string) {
		if (StartType === "Impulse") {
			this.Impulse();
			return;
		}
		if (this.IsSliding || !this.CanSlide || !this.States.IsGrounded()) return;

		let timeSinceSlideStart = 0;

		let rayResult = Workspace.Raycast(this.Model.RightUpperLeg.Position, RAY_DIRECTION, this.RayParams);
		if (!rayResult) rayResult = Workspace.Raycast(this.Model.LeftUpperLeg.Position, RAY_DIRECTION, this.RayParams);
		if (!rayResult) return;

		this.FloorNormal = rayResult.Normal;
		const slopeVec = Tools.ProjectOnPlane(this.HumanoidRootPart.CFrame.LookVector, this.FloorNormal);

		if (slopeVec.Y > 0.15) return;

		this.Landed = false;
		this.CanSlide = false;
		this.CanImpulse = false;
		this.IsSliding = true;
		this.States.SetState(EMovementState.Sliding, true, 0.05);
		this.SlideIdle.Play(0.35);
		task.delay(0.5, () => (this.CanImpulse = true));

		this.HumanoidRootPart.CanCollide = false;
		this.Model.UpperTorso.CanCollide = false;
		this.Model.Head.CanCollide = false;
		this.AlignOrientation.Enabled = true;
		this.Attributes.SetAutoRotate(false);
		this.Humanoid.ChangeState(Enum.HumanoidStateType.Physics);
		this.HumanoidRootPart.AssemblyLinearVelocity = this.HumanoidRootPart.AssemblyLinearVelocity.mul(0.85);
		this.HumanoidRootPart.ApplyImpulse(
			slopeVec.Unit.mul(this.HumanoidRootPart.AssemblyMass).mul(SLIDE_ACCELERATION),
		);

		this.OnPostMovement = this.Butler.Connect(RunService.Heartbeat, (dt) => {
			timeSinceSlideStart += dt;

			const slideDirection = this.Attributes.IsCameraLocked()
				? Tools.ProjectOnPlane(this.Camera.CFrame.LookVector, this.FloorNormal).Unit
				: Tools.ProjectOnPlane(this.HumanoidRootPart.CFrame.LookVector, this.FloorNormal).Unit;

			if (this.IsGrounded) {
				const LinearVelocity = Tools.ProjectOnPlane(
					this.HumanoidRootPart.AssemblyLinearVelocity,
					this.FloorNormal,
				);
				const targetVelocity = slideDirection.mul(LinearVelocity.Magnitude);
				const smoothedVelocity = LinearVelocity.Lerp(targetVelocity, TURN_SENSITIVITY * dt);
				this.HumanoidRootPart.AssemblyLinearVelocity = smoothedVelocity.mul(SLIDE_DEACCELERATION);
			}

			this.AlignOrientation.CFrame = CFrame.lookAt(Vector3.zero, this.HumanoidRootPart.AssemblyLinearVelocity);

			if (timeSinceSlideStart >= 0.1) {
				const rayResult = Workspace.Raycast(this.Model.LowerTorso.Position, RAY_DIRECTION, this.RayParams);

				if (rayResult) {
					this.IsGrounded = true;
					this.FloorNormal = rayResult.Normal;
				} else if (this.IsGrounded && !this.OnUngrounded) this.OnHitNothing();
			}

			if (
				timeSinceSlideStart >= 0.2 &&
				this.HumanoidRootPart.AssemblyLinearVelocity.Magnitude < EMovementSpeeds.Default + 0.5
			)
				this.Stop(false);
		});

		this.SlideHitbox.HitStart();
	}

	public Stop(partial: boolean = false) {
		if (!this.IsSliding) return;
		task.delay(SLIDE_COOLDOWN, () => (this.CanSlide = true));
		this.IsSliding = false;
		this.AlignOrientation.Enabled = false;
		this.HumanoidRootPart.CanCollide = true;
		this.Model.UpperTorso.CanCollide = true;
		this.Model.Head.CanCollide = true;
		this.Humanoid.ChangeState(Enum.HumanoidStateType.Running);
		this.States.SetState(EMovementState.Sliding, false);

		if (!partial) {
			this.Attributes.SetAutoRotate(true);
			if (this.States.IsMoving() && this.Controls.IsKeyDown(ESettingsControls.Sprint))
				this.Styles.Start(EStyleType.Run, EStartType.Resume);
			else this.Styles.Stop(EStyleType.Run, EStopType.Stop);
		}

		this.SlideHitbox.HitStop();

		if (this.OnPostMovement) {
			this.Butler.Remove(this.OnPostMovement);
			this.OnPostMovement = undefined;
		}
		this.SlideIdle.Stop(0.3);
	}

	public Impulse() {
		if (!this.IsGrounded || !this.CanImpulse) return;
		this.States.SetState(EMovementState.SlidingJump, true);
		this.Stop(true);
		this.SlideJump.Play(0.3, 1, 1.15);

		const forwardImpulse = this.HumanoidRootPart.CFrame.LookVector.mul(
			JUMP_SLIDE_SPEED * this.HumanoidRootPart.AssemblyMass,
		);
		const upwardImpulse = new Vector3(0, JUMP_SLIDE_UP * this.HumanoidRootPart.AssemblyMass, 0);

		this.HumanoidRootPart.ApplyImpulse(forwardImpulse.add(upwardImpulse));
		this.Attributes.SetAutoRotate(true);
	}

	private StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
		if (newState !== Enum.HumanoidStateType.Landed) return;

		if (this.Controls.IsKeyDown(ESettingsControls.Crouch) && this.Controls.IsKeyDown(ESettingsControls.Sprint)) {
			if (this.States.IsInState(EMovementState.SlidingJump)) {
				this.States.SetState(EMovementState.Sliding, true);
				this.States.SetState(EMovementState.SlidingJump, false);
				this.SlideJump.Stop(0.15);
			}

			this.Start();
			return;
		}

		if (this.Landed || !this.States.IsInState(EMovementState.SlidingJump)) return;
		this.Landed = true;
		this.States.SetState(EMovementState.SlidingJump, false);
		this.SlideJump.Stop(0.15);
		this.Styles.Start(EStyleType.Run, EStartType.Resume);
	}
}

export { Default_Hands_Slide, Default_Hands_SlideInfo };
