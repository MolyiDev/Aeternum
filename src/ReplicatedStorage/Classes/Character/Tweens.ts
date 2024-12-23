import { RunService, TweenService, Workspace } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { Character } from ".";
import CameraShaker from "@rbxts/camera-shaker";
import { EDashMode } from "ReplicatedStorage/Enums/Dash/EDashMode";
import { EDashDirection } from "ReplicatedStorage/Enums/Dash/EDashDirection";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { Attributes } from "./Attributes";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";

interface IDashInfo {
	Direction: EDashDirection;
	Mode: EDashMode;
	Time: number;
	InitialSpeed: number;
	FinalSpeed: number;
	Stun: boolean;
	CurrentTime: number;
}

export class Tweens {
	private Camera: Camera;
	private Humanoid: Humanoid;
	private HumanoidRootPart: BasePart;
	private Attributes: Attributes;

	private TargetCameraFov = ECameraFovs.Default;
	private TargetSpeed = EMovementSpeeds.Default;
	private TargetJump = EMovementJumps.Default;

	private InitialCameraFov = ECameraFovs.Default;
	private InitialSpeed = EMovementSpeeds.Default;
	private InitialJump = EMovementJumps.Default;

	private InfoCamera = new TweenInfo(0);
	private InfoSpeed = new TweenInfo(0);
	private InfoJump = new TweenInfo(0);

	private TimeElapsedCamera = 0;
	private TimeElapsedSpeed = 0;
	private TimeElapsedJump = 0;

	private HeartbeatConnection?: RBXScriptConnection;

	private BodyVelocity?: BodyVelocity;
	private DashInfo?: IDashInfo;
	private CameraShaker: CameraShaker;

	constructor(character: Character) {
		this.Camera = Workspace.CurrentCamera!;
		this.Humanoid = character.Humanoid;
		this.HumanoidRootPart = character.HumanoidRootPart;
		this.Attributes = character.Attributes;

		this.CameraShaker = new CameraShaker(
			Enum.RenderPriority.Camera.Value,
			(shakeCFrame) => (this.Camera.CFrame = this.Camera.CFrame.mul(shakeCFrame)),
		);
		this.CameraShaker.Start();
	}

	public Destroy() {
		this.Pause();

		this.Camera = undefined!;
		this.Humanoid = undefined!;

		this.TargetCameraFov = undefined!;
		this.TargetSpeed = undefined!;
		this.TargetJump = undefined!;

		this.InitialCameraFov = undefined!;
		this.InitialSpeed = undefined!;
		this.InitialJump = undefined!;

		this.InfoCamera = undefined!;
		this.InfoSpeed = undefined!;
		this.InfoJump = undefined!;

		this.TimeElapsedCamera = undefined!;
		this.TimeElapsedSpeed = undefined!;
		this.TimeElapsedJump = undefined!;
	}

	public Pause() {
		if (!this.HeartbeatConnection) return;
		this.HeartbeatConnection.Disconnect();
		this.HeartbeatConnection = undefined;
	}

	public Resume() {
		if (this.HeartbeatConnection) return;
		this.HeartbeatConnection = RunService.Heartbeat.Connect((deltaTime) => this.Heartbeat(deltaTime));
	}

	public SetCameraFov(fov: number, time: number) {
		if (this.TargetCameraFov === fov) return;
		this.InitialCameraFov = this.Camera.FieldOfView;
		this.TargetCameraFov = fov;
		this.InfoCamera = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		this.TimeElapsedCamera = 0;
		this.Resume();
	}

	public SetSpeed(speed: number, time: number) {
		this.InitialSpeed = this.Humanoid.WalkSpeed;
		this.TargetSpeed = speed;
		this.InfoSpeed = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		this.TimeElapsedSpeed = 0;
		this.Resume();
	}

	public SetJump(jump: number, time: number) {
		this.InitialJump = this.Humanoid.JumpPower;
		this.TargetJump = jump;
		this.InfoJump = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		this.TimeElapsedJump = 0;
		this.Resume();
	}

	public SetDash = (dashInfo: Partial<IDashInfo>) => {
		if (!this.BodyVelocity) {
			this.BodyVelocity = new Instance("BodyVelocity", this.HumanoidRootPart);
			this.BodyVelocity.MaxForce = new Vector3(math.huge, 0, math.huge);
		}

		dashInfo.CurrentTime = 0;
		//if (dashInfo.Stun) this.Attributes.SelfStun(dashInfo.Time! / 1.05, EStunType.SemiPartial, false);
		this.DashInfo = dashInfo as IDashInfo;

		this.Resume();
	};

	public GetCameraShaker = () => this.CameraShaker;

	private Heartbeat(dt: number) {
		this.TimeElapsedCamera = math.min(this.TimeElapsedCamera + dt, this.InfoCamera.Time);
		this.TimeElapsedSpeed = math.min(this.TimeElapsedSpeed + dt, this.InfoSpeed.Time);
		this.TimeElapsedJump = math.min(this.TimeElapsedJump + dt, this.InfoJump.Time);

		if (this.InfoCamera.Time > 0) {
			const alphaCamera = this.TimeElapsedCamera / this.InfoCamera.Time;
			const easedAlphaCamera = TweenService.GetValue(
				alphaCamera,
				this.InfoCamera.EasingStyle,
				this.InfoCamera.EasingDirection,
			);
			this.Camera.FieldOfView =
				this.InitialCameraFov + (this.TargetCameraFov - this.InitialCameraFov) * easedAlphaCamera;
		}

		if (this.InfoSpeed.Time > 0) {
			const alphaSpeed = this.TimeElapsedSpeed / this.InfoSpeed.Time;
			const easedAlphaSpeed = TweenService.GetValue(
				alphaSpeed,
				this.InfoSpeed.EasingStyle,
				this.InfoSpeed.EasingDirection,
			);
			this.Humanoid.WalkSpeed = this.InitialSpeed + (this.TargetSpeed - this.InitialSpeed) * easedAlphaSpeed;
		}

		if (this.InfoJump.Time > 0) {
			const alphaJump = this.TimeElapsedJump / this.InfoJump.Time;
			const easedAlphaJump = TweenService.GetValue(
				alphaJump,
				this.InfoJump.EasingStyle,
				this.InfoJump.EasingDirection,
			);
			this.Humanoid.JumpPower = this.InitialJump + (this.TargetJump - this.InitialJump) * easedAlphaJump;
		}

		if (this.DashInfo) {
			const progress = math.clamp(this.DashInfo.CurrentTime / this.DashInfo.Time, 0, 1);
			const speed = Tools.LerpNumber(this.DashInfo.InitialSpeed, this.DashInfo.FinalSpeed, progress);
			const MoveDirection = this.GetMoveDirection(this.DashInfo.Mode).Unit;

			this.BodyVelocity!.Velocity = MoveDirection.mul(speed);

			this.DashInfo.CurrentTime += dt;
			if (this.DashInfo.CurrentTime >= this.DashInfo.Time) {
				this.BodyVelocity!.Destroy();
				this.BodyVelocity = undefined;
				this.DashInfo = undefined;
			}
		}

		if (
			this.TimeElapsedCamera === this.InfoCamera.Time &&
			this.TimeElapsedSpeed === this.InfoSpeed.Time &&
			this.TimeElapsedJump === this.InfoJump.Time &&
			!this.DashInfo &&
			this.HeartbeatConnection
		) {
			this.HeartbeatConnection.Disconnect();
			this.HeartbeatConnection = undefined!;
		}
	}

	private GetMoveDirection(mode: EDashMode): Vector3 {
		let moveVector = new Vector3(0, 0, 0);

		if (mode === EDashMode.Camera) {
			switch (this.DashInfo!.Direction) {
				case EDashDirection.Forward:
					if (mode === EDashMode.Camera) moveVector = moveVector.add(this.Camera.CFrame.LookVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.ForwardRight:
					if (mode === EDashMode.Camera)
						moveVector = moveVector.add(this.Camera.CFrame.LookVector).add(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.ForwardLeft:
					if (mode === EDashMode.Camera)
						moveVector = moveVector.add(this.Camera.CFrame.LookVector).sub(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.Back:
					if (mode === EDashMode.Camera) moveVector = moveVector.sub(this.Camera.CFrame.LookVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.BackRight:
					if (mode === EDashMode.Camera)
						moveVector = moveVector.sub(this.Camera.CFrame.LookVector).add(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.BackLeft:
					if (mode === EDashMode.Camera)
						moveVector = moveVector.sub(this.Camera.CFrame.LookVector).sub(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.Right:
					moveVector = moveVector.add(this.Camera.CFrame.RightVector);
					break;
				case EDashDirection.Left:
					moveVector = moveVector.sub(this.Camera.CFrame.RightVector);
					break;
			}
		} else {
			if (this.DashInfo!.Direction === EDashDirection.Back)
				moveVector = moveVector.sub(this.HumanoidRootPart.CFrame.LookVector);
			else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
		}

		return moveVector;
	}
}
