// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { RunService, Workspace } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EStartType } from "ReplicatedStorage/Enums/Style/EStartType";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Climb}`;

const TemporalFolder = Workspace.WaitForChild("Temporal") as Folder;

const CLIMB_SPEED = 0.2;
const DISTANCE_FROM_SURFACE = 1.2;
const LEDGE_CHECK_DISTANCE = 5;
const FADE_IN = 0.2;
const FADE_OUT = 0.2;

const Default_Hands_ClimbInfo = {
	[EAnimations.Default_Hands_ClimbMoveUp]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbMoveDown]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbMoveLeft]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbMoveRight]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbImpulseUp]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbImpulseBack]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbImpulseLeft]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbImpulseRight]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_ClimbIdle]: {
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
class Default_Hands_Climb extends CStyle {
	private IsClimbing: boolean = false;
	private Impulsed: boolean = false;
	private ClimbImpulseDirection: Vector3 = Vector3.zero;
	private ClimbDirection: Vector3 = Vector3.zero;
	private ClimbConnection: RBXScriptConnection | undefined;

	private ClimbMoveUp: AnimationTrack;
	private ClimbMoveDown: AnimationTrack;
	private ClimbMoveLeft: AnimationTrack;
	private ClimbMoveRight: AnimationTrack;
	private ClimbImpulseUp: AnimationTrack;
	private ClimbImpulseBack: AnimationTrack;
	private ClimbImpulseLeft: AnimationTrack;
	private ClimbImpulseRight: AnimationTrack;
	private ClimbIdle: AnimationTrack;

	private AlignPart: BasePart | undefined;
	private AlignOrientation: AlignOrientation;
	private AlignPosition: AlignPosition;
	private RayParams: RaycastParams = new RaycastParams();

	private Connections: RBXScriptConnection[];

	constructor(character: Character) {
		super(character);
		[
			this.ClimbMoveUp,
			this.ClimbMoveDown,
			this.ClimbMoveLeft,
			this.ClimbMoveRight,
			this.ClimbImpulseUp,
			this.ClimbImpulseBack,
			this.ClimbImpulseLeft,
			this.ClimbImpulseRight,
			this.ClimbIdle,
		] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_ClimbMoveUp,
			EAnimations.Default_Hands_ClimbMoveDown,
			EAnimations.Default_Hands_ClimbMoveLeft,
			EAnimations.Default_Hands_ClimbMoveRight,
			EAnimations.Default_Hands_ClimbImpulseUp,
			EAnimations.Default_Hands_ClimbImpulseBack,
			EAnimations.Default_Hands_ClimbImpulseLeft,
			EAnimations.Default_Hands_ClimbImpulseRight,
			EAnimations.Default_Hands_ClimbIdle,
		);

		const RootAttachment = this.HumanoidRootPart.RootAttachment;

		const AlignOrientation = new Instance("AlignOrientation", this.HumanoidRootPart);
		AlignOrientation.Enabled = false;
		AlignOrientation.MaxTorque = math.huge;
		AlignOrientation.Attachment0 = RootAttachment;
		AlignOrientation.Responsiveness = 40;
		this.AlignOrientation = AlignOrientation;

		const AlignPosition = new Instance("AlignPosition", this.HumanoidRootPart);
		AlignPosition.Enabled = false;
		AlignPosition.MaxForce = math.huge;
		AlignPosition.Attachment0 = RootAttachment;
		AlignPosition.Responsiveness = 40;
		this.AlignPosition = AlignPosition;

		this.RayParams.AddToFilter(this.Model);
		this.RayParams.FilterType = Enum.RaycastFilterType.Exclude;

		let Direction = "Zero";

		this.Connections = [
			this.Butler.Connect(this.ClimbImpulseUp.GetMarkerReachedSignal("Impulse"), () => this.Impulse()),
			this.Butler.Connect(this.ClimbImpulseBack.GetMarkerReachedSignal("Impulse"), () => this.Impulse()),
			this.Butler.Connect(this.ClimbImpulseLeft.GetMarkerReachedSignal("Impulse"), () => this.Impulse()),
			this.Butler.Connect(this.ClimbImpulseRight.GetMarkerReachedSignal("Impulse"), () => this.Impulse()),

			this.Butler.Connect(this.Humanoid.GetPropertyChangedSignal("MoveDirection"), () => {
				if (!this.IsClimbing) return;
				const actualDirection = Tools.WorldMovingDirection(
					this.Character.HumanoidRootPart.CFrame.VectorToObjectSpace(this.Character.Humanoid.MoveDirection),
				);

				switch (actualDirection) {
					case new Vector3(0, 0, -1): // Front
						if (Direction === "Front") return;
						Direction = "Front";
						print(Direction);
						break;
					case new Vector3(-1, 0, -1): // Front-Left
						if (Direction === "FrontLeft") return;
						Direction = "FrontLeft";
						print(Direction);
						break;
					case new Vector3(1, 0, -1): // Front-Right
						if (Direction === "FrontRight") return;
						Direction = "FrontRight";
						print(Direction);
						break;
					case new Vector3(0, 0, 1): // Back
						if (Direction === "Back") return;
						Direction = "Back";
						print(Direction);
						break;
					case new Vector3(-1, 0, 1): // Back-Left
						if (Direction === "BackLeft") return;
						Direction = "BackLeft";
						print(Direction);
						break;
					case new Vector3(1, 0, 1): // Back-Right
						if (Direction === "BackRight") return;
						Direction = "BackRight";
						print(Direction);
						break;
					case new Vector3(1, 0, 0): // Right
						if (Direction === "Right") return;
						Direction = "Right";
						print(Direction);
						break;
					case new Vector3(-1, 0, 0): // Left
						if (Direction === "Left") return;
						Direction = "Left";
						print(Direction);
						break;
					default:
						if (Direction === "Zero") return;
						Direction = "Zero";
						print(Direction);
						break;
				}
			}),

			this.Butler.Connect(this.Humanoid.StateChanged, (oldState, newState) =>
				this.StateChanged(oldState, newState),
			),
		];

		if (character.Player) {
			this.Connections.push(
				this.Butler.Connect(this.Controls.InputBeganSignal, (control, input, doublePressed) =>
					this.InputBegin(control, input, doublePressed),
				),

				this.Butler.Connect(this.Controls.InputEndedSignal, (control, input) =>
					this.InputEnded(control, input),
				),
			);
		}
	}

	public Destroy() {
		this.Butler.Remove(this.ClimbConnection);
		this.Butler.RemoveList(this.Connections);
		this.Connections.clear();
		this.AlignPart?.Destroy();
		this.AlignOrientation.Destroy();
		this.AlignPosition.Destroy();

		this.IsClimbing = undefined!;
		this.Impulsed = undefined!;
		this.ClimbImpulseDirection = undefined!;
		this.ClimbDirection = undefined!;
		this.ClimbConnection = undefined!;
		this.ClimbMoveUp = undefined!;
		this.ClimbMoveDown = undefined!;
		this.ClimbMoveLeft = undefined!;
		this.ClimbMoveRight = undefined!;
		this.ClimbImpulseUp = undefined!;
		this.ClimbImpulseBack = undefined!;
		this.ClimbImpulseLeft = undefined!;
		this.ClimbImpulseRight = undefined!;
		this.ClimbIdle = undefined!;
		this.AlignPart = undefined!;
		this.AlignOrientation = undefined!;
		this.AlignPosition = undefined!;
		this.RayParams = undefined!;
		this.Connections = undefined!;

		super.Destroy();
	}

	public Start() {
		if (this.IsClimbing) return;

		const rayResult = this.DetectWall(this.HumanoidRootPart.CFrame);
		if (!rayResult) return;
		const hitCharacter = rayResult.Instance.Parent as IModel;
		const hitHumanoid = hitCharacter?.FindFirstChild("Humanoid");
		if (hitHumanoid) return;

		this.ClimbDirection = Vector3.zero;

		if (this.Controls.IsKeyDown(ESettingsControls.Forward))
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(0, 1, 0));
		if (this.Controls.IsKeyDown(ESettingsControls.Back))
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(0, -1, 0));
		if (this.Controls.IsKeyDown(ESettingsControls.Left))
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(-1, 0, 0));
		if (this.Controls.IsKeyDown(ESettingsControls.Right))
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(1, 0, 0));

		this.IsClimbing = true;
		this.Impulsed = false;

		this.AlignPart = new Instance("Part", TemporalFolder);
		this.AlignPart.Size = Vector3.one;
		this.AlignPart.Anchored = true;
		this.AlignPart.Transparency = 1;
		this.AlignPart.Massless = true;
		this.AlignPart.CanCollide = false;
		this.AlignPart.CanTouch = false;
		this.AlignPart.CanQuery = false;

		this.AlignOrientation.Attachment1 = new Instance("Attachment", this.AlignPart);
		this.AlignPosition.Attachment1 = new Instance("Attachment", this.AlignPart);

		const targetCFrame = CFrame.fromMatrix(
			rayResult.Position.add(
				this.HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection.mul(CLIMB_SPEED)),
			).add(rayResult.Normal.mul(DISTANCE_FROM_SURFACE)),
			rayResult.Normal.Cross(this.HumanoidRootPart.CFrame.UpVector).mul(-1),
			rayResult.Normal.Cross(this.HumanoidRootPart.CFrame.RightVector),
		);

		this.AlignPart.CFrame = targetCFrame;

		this.AlignPosition.Enabled = true;
		this.AlignOrientation.Enabled = true;
		this.Attributes.SetAutoRotate(false);

		this.Humanoid.PlatformStand = true;
		this.States.SetState(EMovementState.Climbing, true, FADE_OUT);
		this.StopMovements(FADE_OUT);
		this.StopImpulses(FADE_OUT);

		this.ClimbIdle.Play(FADE_IN);

		this.ClimbConnection = this.Butler.Connect(RunService.Heartbeat, () => {
			if (!this.IsClimbing || this.ClimbDirection === Vector3.zero) return;

			const resultMiddle = this.DetectWall(
				this.HumanoidRootPart.CFrame.add(this.HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection)),
			);

			if (!resultMiddle) {
				if (this.Controls.IsKeyDown(ESettingsControls.Sprint)) this.ClimbImpulse();
				return;
			}

			const targetCFrame = CFrame.fromMatrix(
				resultMiddle.Position.add(
					this.HumanoidRootPart.CFrame.VectorToWorldSpace(this.ClimbDirection.mul(CLIMB_SPEED)),
				).add(resultMiddle.Normal.mul(DISTANCE_FROM_SURFACE)),
				resultMiddle.Normal.Cross(this.HumanoidRootPart.CFrame.UpVector).mul(-1),
				resultMiddle.Normal.Cross(this.HumanoidRootPart.CFrame.RightVector),
			);

			this.AlignPart!.CFrame = targetCFrame;
		});
	}

	public Stop(StopType: string = "Normal", fullOrSpeed: boolean | number = false) {
		if (StopType === "Impulses") {
			this.StopImpulses(fullOrSpeed as number);
			return;
		}
		print(1);
		if (!this.IsClimbing) return;
		this.IsClimbing = false;

		if (this.ClimbConnection) {
			this.Butler.Remove(this.ClimbConnection);
			this.ClimbConnection = undefined;
		}

		this.ClimbIdle.Stop(FADE_OUT);
		print(2);
		this.StopMovements(FADE_OUT);

		if (!fullOrSpeed) return;
		this.Attributes.SetAutoRotate(true);
		this.States.SetState(EMovementState.Climbing, false);
		this.AlignPosition.Enabled = false;
		this.AlignOrientation.Enabled = false;
		this.Humanoid.PlatformStand = false;
		this.AlignPart?.Destroy();
		this.Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
	}

	private DetectWall(cf: CFrame) {
		const rayResult = Workspace.Raycast(cf.Position, cf.LookVector.mul(LEDGE_CHECK_DISTANCE), this.RayParams);
		if (rayResult && rayResult.Instance.Size.Magnitude > 2) return rayResult;
		return undefined;
	}

	private CheckDirection() {
		if (!this.IsClimbing) return;

		if (this.ClimbDirection === Vector3.zero) {
			this.StopMovements(FADE_OUT);
			return;
		}

		switch (this.ClimbDirection.Y) {
			case 1:
				if (!this.ClimbMoveUp.IsPlaying) this.ClimbMoveUp.Play(FADE_IN);
				if (this.ClimbMoveDown.IsPlaying) this.ClimbMoveDown.Stop(FADE_OUT);
				break;
			case -1:
				if (!this.ClimbMoveDown.IsPlaying) this.ClimbMoveDown.Play(FADE_IN, 1, -1);
				if (this.ClimbMoveUp.IsPlaying) this.ClimbMoveUp.Stop(FADE_OUT);
				break;
			default:
				if (this.ClimbMoveUp.IsPlaying) this.ClimbMoveUp.Stop(FADE_OUT);
				if (this.ClimbMoveDown.IsPlaying) this.ClimbMoveDown.Stop(FADE_OUT);
				break;
		}

		switch (this.ClimbDirection.X) {
			case 1:
				if (!this.ClimbMoveRight.IsPlaying) this.ClimbMoveRight.Play(FADE_IN);
				if (this.ClimbMoveLeft.IsPlaying) this.ClimbMoveLeft.Stop(FADE_OUT);
				break;
			case -1:
				if (!this.ClimbMoveLeft.IsPlaying) this.ClimbMoveLeft.Play(FADE_IN, 1, -1);
				if (this.ClimbMoveRight.IsPlaying) this.ClimbMoveRight.Stop(FADE_OUT);
				break;
			default:
				if (this.ClimbMoveLeft.IsPlaying) this.ClimbMoveLeft.Stop(FADE_OUT);
				if (this.ClimbMoveRight.IsPlaying) this.ClimbMoveRight.Stop(FADE_OUT);
				break;
		}
	}

	private ClimbImpulse() {
		this.ClimbImpulseDirection = this.ClimbDirection;
		this.Stop();

		if (this.ClimbImpulseDirection === Vector3.zero) this.ClimbImpulseDirection = new Vector3(0, -1, 0);

		if (this.ClimbImpulseDirection.X === 1) this.ClimbImpulseRight.Play(0.2);
		else if (this.ClimbImpulseDirection.X === -1) this.ClimbImpulseLeft.Play(0.2);

		if (this.ClimbImpulseDirection.Y === 1) this.ClimbImpulseUp.Play(0.2);
		else if (this.ClimbImpulseDirection.Y === -1) this.ClimbImpulseBack.Play(0.2);
	}

	private StopMovements(fading: number) {
		this.ClimbMoveUp.Stop(fading);
		this.ClimbMoveDown.Stop(fading);
		this.ClimbMoveLeft.Stop(fading);
		this.ClimbMoveRight.Stop(fading);
	}

	private StopImpulses(fading: number | undefined) {
		this.ClimbImpulseUp.Stop(fading);
		this.ClimbImpulseBack.Stop(fading);
		this.ClimbImpulseLeft.Stop(fading);
		this.ClimbImpulseRight.Stop(fading);
	}

	private Impulse() {
		if (this.Impulsed) return;
		this.Impulsed = true;

		this.Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
		this.States.SetState(EMovementState.Climbing, false);
		this.AlignPart?.Destroy();
		this.Attributes.SetAutoRotate(true);
		this.AlignPosition.Enabled = false;
		this.AlignOrientation.Enabled = false;
		if (this.ClimbImpulseDirection.Y === 0)
			this.ClimbImpulseDirection = this.ClimbImpulseDirection.add(new Vector3(0, 0.65, 0));
		const forwardImpulse = this.HumanoidRootPart.CFrame.RightVector.mul(this.ClimbImpulseDirection.X);
		const sidewaysImpulse = this.HumanoidRootPart.CFrame.RightVector.mul(this.ClimbImpulseDirection.Z);
		const upwardImpulse = this.HumanoidRootPart.CFrame.UpVector.mul(math.abs(this.ClimbImpulseDirection.Y));
		const backwardImpulse =
			this.ClimbImpulseDirection.Y === -1
				? this.HumanoidRootPart.CFrame.LookVector.mul(this.ClimbImpulseDirection.Y)
				: Vector3.zero;

		const direction = forwardImpulse.add(sidewaysImpulse).add(upwardImpulse).add(backwardImpulse);
		this.HumanoidRootPart.AssemblyLinearVelocity = direction.mul(75);
		this.Humanoid.PlatformStand = false;
	}

	private StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
		if (newState === Enum.HumanoidStateType.Landed) this.StopMovements(0.1);
	}

	public InputBegin(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
		if (!control || !this.IsClimbing) return;

		if (control[0] === ESettingsControls.Forward) {
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(0, 1, 0));
			if (doublePressed) this.ClimbImpulse();
		} else if (control[0] === ESettingsControls.Back) {
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(0, -1, 0));
			if (doublePressed) this.ClimbImpulse();
		} else if (control[0] === ESettingsControls.Left) {
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(-1, 0, 0));
			if (doublePressed) this.ClimbImpulse();
		} else if (control[0] === ESettingsControls.Right) {
			this.ClimbDirection = this.ClimbDirection.add(new Vector3(1, 0, 0));
			if (doublePressed) this.ClimbImpulse();
		}

		this.CheckDirection();
	}

	public InputEnded(control: [string, number] | undefined, input: InputObject | undefined) {
		if (!control || !this.IsClimbing) return;

		if (control[0] === ESettingsControls.Forward)
			this.ClimbDirection = this.ClimbDirection.sub(new Vector3(0, 1, 0));
		else if (control[0] === ESettingsControls.Back)
			this.ClimbDirection = this.ClimbDirection.sub(new Vector3(0, -1, 0));
		else if (control[0] === ESettingsControls.Left)
			this.ClimbDirection = this.ClimbDirection.sub(new Vector3(-1, 0, 0));
		else if (control[0] === ESettingsControls.Right)
			this.ClimbDirection = this.ClimbDirection.sub(new Vector3(1, 0, 0));

		this.CheckDirection();
	}
}

export { Default_Hands_Climb, Default_Hands_ClimbInfo };
