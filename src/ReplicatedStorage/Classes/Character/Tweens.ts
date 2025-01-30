import { Lighting, Players, RunService, TweenService, Workspace } from "@rbxts/services";
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
import { EBlur } from "ReplicatedStorage/Enums/EBlur";

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
	private Camera: Camera = undefined!;
	private Blur: BlurEffect = undefined!;
	private Humanoid: Humanoid;
	private HumanoidRootPart: BasePart;
	private Attributes: Attributes;

	public TargetCameraFov = ECameraFovs.Default;
	public TargetBlur = EBlur.Default;
	public TargetSpeed = EMovementSpeeds.Default;
	public TargetJump = EMovementJumps.Default;

	private InitialCameraFov = ECameraFovs.Default;
	private InitialBlur = EBlur.Default;
	private InitialSpeed = EMovementSpeeds.Default;
	private InitialJump = EMovementJumps.Default;

	private InfoCamera = new TweenInfo(0);
	private InfoBlur = new TweenInfo(0);
	private InfoSpeed = new TweenInfo(0);
	private InfoJump = new TweenInfo(0);

	private TimeElapsedCamera = 0;
	private TimeElapsedBlur = 0;
	private TimeElapsedSpeed = 0;
	private TimeElapsedJump = 0;

	private HeartbeatConnection?: RBXScriptConnection;

	private BodyVelocity?: BodyVelocity;
	private DashInfo?: IDashInfo;
	private CameraShaker: CameraShaker = undefined!;

	constructor(character: Character) {
		this.Humanoid = character.Humanoid;
		this.HumanoidRootPart = character.HumanoidRootPart;
		this.Attributes = character.Attributes;

		if (character.Player && character.Player === Players.LocalPlayer) {
			this.Camera = Workspace.CurrentCamera!;
			this.Blur = Lighting.WaitForChild("Blur") as BlurEffect;

			this.CameraShaker = new CameraShaker(
				Enum.RenderPriority.Camera.Value,
				(shakeCFrame) => (this.Camera.CFrame = this.Camera.CFrame.mul(shakeCFrame)),
			);
			this.CameraShaker.Start();
		}
	}

	public Destroy() {
		this.Pause();

		this.Camera = undefined!;
		this.Humanoid = undefined!;

		this.TargetCameraFov = undefined!;
		this.TargetBlur = undefined!;
		this.TargetSpeed = undefined!;
		this.TargetJump = undefined!;

		this.InitialCameraFov = undefined!;
		this.InitialBlur = undefined!;
		this.InitialSpeed = undefined!;
		this.InitialJump = undefined!;

		this.InfoCamera = undefined!;
		this.InfoBlur = undefined!;
		this.InfoSpeed = undefined!;
		this.InfoJump = undefined!;

		this.TimeElapsedCamera = undefined!;
		this.TimeElapsedBlur = undefined!;
		this.TimeElapsedSpeed = undefined!;
		this.TimeElapsedJump = undefined!;

		this.BodyVelocity?.Destroy();
		this.CameraShaker?.Stop();

		this.HeartbeatConnection = undefined!;
		this.DashInfo = undefined!;
		this.CameraShaker = undefined!;
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

	public SetBlur(blur: number, time: number) {
		if (this.TargetBlur === blur) return;
		this.InitialBlur = this.Blur.Size;
		this.TargetBlur = blur;
		this.InfoBlur = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		this.TimeElapsedBlur = 0;
		this.Resume();
	}

	public SetSpeed(speed: number, time: number) {
		if (this.TargetSpeed === speed) return;
		this.InitialSpeed = this.Humanoid.WalkSpeed;
		this.TargetSpeed = speed;
		this.InfoSpeed = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		this.TimeElapsedSpeed = 0;
		this.Resume();
	}

	public SetJump(jump: number, time: number) {
		if (this.TargetJump === jump) return;
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
		if (dashInfo.Stun) this.Attributes.SelfStun(dashInfo.Time!, EStunType.SemiPartial, false);
		this.DashInfo = dashInfo as IDashInfo;

		this.Resume();
	};

	public GetCameraShaker = () => this.CameraShaker;

	private Heartbeat(dt: number) {
		this.TimeElapsedCamera = math.min(this.TimeElapsedCamera + dt, this.InfoCamera.Time);
		this.TimeElapsedBlur = math.min(this.TimeElapsedBlur + dt, this.InfoBlur.Time);
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

		if (this.InfoBlur.Time > 0) {
			const alphaBlur = this.TimeElapsedBlur / this.InfoBlur.Time;
			const easedAlphaBlur = TweenService.GetValue(
				alphaBlur,
				this.InfoBlur.EasingStyle,
				this.InfoBlur.EasingDirection,
			);
			this.Blur.Size = this.InitialBlur + (this.TargetBlur - this.InitialBlur) * easedAlphaBlur;
		}

		if (this.InfoSpeed.Time > 0) {
			const alphaSpeed = this.TimeElapsedSpeed / this.InfoSpeed.Time;
			const easedAlphaSpeed = TweenService.GetValue(
				alphaSpeed,
				this.InfoSpeed.EasingStyle,
				this.InfoSpeed.EasingDirection,
			);
			if (!this.Attributes.IsStunned())
				this.Humanoid.WalkSpeed = this.InitialSpeed + (this.TargetSpeed - this.InitialSpeed) * easedAlphaSpeed;
		}

		if (this.InfoJump.Time > 0) {
			const alphaJump = this.TimeElapsedJump / this.InfoJump.Time;
			const easedAlphaJump = TweenService.GetValue(
				alphaJump,
				this.InfoJump.EasingStyle,
				this.InfoJump.EasingDirection,
			);
			if (!this.Attributes.IsStunned())
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
			this.TimeElapsedBlur === this.InfoBlur.Time &&
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

		if (mode === EDashMode.Locked) {
			switch (this.DashInfo!.Direction) {
				case EDashDirection.Forward:
					if (mode === EDashMode.Locked) moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.ForwardRight:
					if (mode === EDashMode.Locked)
						moveVector = moveVector
							.add(this.HumanoidRootPart.CFrame.LookVector)
							.add(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.ForwardLeft:
					if (mode === EDashMode.Locked)
						moveVector = moveVector
							.add(this.HumanoidRootPart.CFrame.LookVector)
							.sub(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.Back:
					if (mode === EDashMode.Locked) moveVector = moveVector.sub(this.HumanoidRootPart.CFrame.LookVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.BackRight:
					if (mode === EDashMode.Locked)
						moveVector = moveVector
							.sub(this.HumanoidRootPart.CFrame.LookVector)
							.add(this.Camera.CFrame.RightVector);
					else moveVector = moveVector.add(this.HumanoidRootPart.CFrame.LookVector);
					break;
				case EDashDirection.BackLeft:
					if (mode === EDashMode.Locked)
						moveVector = moveVector
							.sub(this.HumanoidRootPart.CFrame.LookVector)
							.sub(this.Camera.CFrame.RightVector);
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
