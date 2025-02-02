// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EStartType } from "ReplicatedStorage/Enums/Style/EStartType";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EStopType } from "ReplicatedStorage/Enums/Style/EStopType";
import { RunService } from "@rbxts/services";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Run}`;

const ANIM_SPEED = 2.25;
const MOMENTUM_FINALIZE_DURATION = 6.25;
const FADE_IN = 0.25;
const FADE_OUT = 0.325;
const LIMIT = 1.32;
const DISTANCE = LIMIT / 2;

const IncludeStates = new Set<EMovementState>([
	EMovementState.Idle,
	EMovementState.Guarding,
	EMovementState.Walking,
	EMovementState.Landing,
	EMovementState.Running,
]);

const Default_Hands_RunInfo = {
	[EAnimations.Default_Hands_RunFront]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_RunFrontLeft]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_RunFrontRight]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_RunLeft]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_RunRight]: {
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

@StyleInfo(Style, {
	ReplicateClass: "Footsteps",
})
class Default_Hands_Run extends CStyle {
	private IsRunning: boolean = false;
	private IsPaused: boolean = false;
	private IsRunningLocked: boolean = false;
	private Time: number = 0;

	private PrevAnimation: AnimationTrack | undefined;
	private PrevAnimationStop: number = 0;
	private PrevAnimationTimePosition: number = 0;
	private RunDirection: Vector3 = Vector3.zero;

	private RunFront: AnimationTrack;
	private RunFrontLeft: AnimationTrack = undefined!;
	private RunFrontRight: AnimationTrack = undefined!;
	private RunLeft: AnimationTrack = undefined!;
	private RunRight: AnimationTrack = undefined!;

	private Connections: RBXScriptConnection[];

	constructor(character: Character) {
		super(character);
		[this.RunFront] = this.Animations.GetAnimations(EAnimations.Default_Hands_RunFront);

		this.Connections = [
			this.Butler.Connect(this.Attributes.AttributeChanged, (attribute) => this.AttributeChanged(attribute)),
			this.Butler.Connect(this.Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => this.RunSpeed()),
		];

		if (character.Player)
			this.Connections.push(
				this.Butler.Connect(this.ShiftLock.ChangedDirection, (direction) => this.MoveDirection(direction)),
			);
	}

	public Destroy() {
		this.Butler.RemoveList(this.Connections);
		this.Connections.clear();

		this.IsRunning = undefined!;
		this.IsPaused = undefined!;
		this.IsRunningLocked = undefined!;
		this.Time = undefined!;
		this.PrevAnimation = undefined!;
		this.PrevAnimationStop = undefined!;
		this.PrevAnimationTimePosition = undefined!;
		this.RunDirection = undefined!;
		this.RunFront = undefined!;
		this.RunFrontLeft = undefined!;
		this.RunFrontRight = undefined!;
		this.RunLeft = undefined!;
		this.RunRight = undefined!;
		this.Connections = undefined!;

		super.Destroy();
	}

	public Start(StartType: EStartType) {
		if (StartType === EStartType.Start) this.RunStart();
		else if (StartType === EStartType.Activate) this.RunActivate();
		else this.RunResume();
	}

	public Stop(StopType: EStopType) {
		if (StopType === EStopType.Stop) this.RunStop();
		else if (StopType === EStopType.Deactivate) this.RunDeactivate();
		else this.RunPause();
	}

	public RunStart() {
		if (this.IsRunning || !this.States.IsGrounded()) return;
		if (this.CanRun()) this.States.SetState(EMovementState.Running, true);
		else this.States.SetState(EMovementState.Running, false);
	}

	public RunActivate() {
		if (this.IsRunning || this.IsPaused || !this.CanRun()) return;
		this.IsRunning = true;

		this.RunFront.Play(0.25, 1, this.AnimSpeed());
		this.RunFront.TimePosition = this.AnimTime();

		this.Tweens.SetCameraFov(ECameraFovs.Run, 1.2);
		this.Tweens.SetSpeed(EMovementSpeeds.Run, 1.2);
		this.Tweens.SetJump(EMovementJumps.Run, 1.2);

		this.Time = 0;
		while (this.IsRunning) {
			task.wait(0.05);
			this.Time += 0.05;
			if (this.Time < 1.3) continue;
			if (!this.IsRunning) break;

			this.Tweens.SetCameraFov(ECameraFovs.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			this.Tweens.SetSpeed(EMovementSpeeds.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			this.Tweens.SetJump(EMovementJumps.RunMomentum, MOMENTUM_FINALIZE_DURATION);
			if (this.IsPaused) this.Tweens.Pause();
			break;
		}
	}

	public RunStop() {
		this.States.SetState(EMovementState.Running, false);
		this.RunDeactivate();
	}

	public RunDeactivate() {
		if (!this.IsRunning) return;
		this.IsRunning = false;
		this.IsPaused = false;

		this.RunFront.Stop(FADE_OUT);

		this.Tweens.SetCameraFov(ECameraFovs.Default, 0.65);

		if (this.Attributes.IsStunned()) return;
		this.Tweens.SetSpeed(EMovementSpeeds.Default, 0.65);
		this.Tweens.SetJump(EMovementJumps.Default, 0.65);
	}

	public RunResume() {
		if (!this.IsPaused || !this.IsRunning || !this.CanRun()) return;
		this.IsPaused = false;
		this.Tweens.Resume();
		this.RunFront.Play(0.25, 1, this.AnimSpeed());
		this.RunFront.TimePosition = this.AnimTime();

		if (this.Humanoid.WalkSpeed < EMovementSpeeds.Run) {
			this.Tweens.SetCameraFov(ECameraFovs.Run, 1.2);
			this.Tweens.SetSpeed(EMovementSpeeds.Run, 1.2);
			this.Tweens.SetJump(EMovementJumps.Run, 1.2);
			this.Time = 0;
		}
	}

	public RunPause() {
		if (this.IsPaused || !this.IsRunning) return;
		this.IsPaused = true;
		this.Tweens.Pause();
		this.RunFront.Stop(0.25);
	}

	public CanRun() {
		return (
			this.Controls.IsKeyDown(ESettingsControls.Sprint) &&
			this.Humanoid.MoveDirection.Magnitude > 0 &&
			!this.Attributes.IsStunned() &&
			IncludeStates.has(this.States.State) &&
			!this.States.IsInState(EMovementState.Blocking) &&
			!this.States.IsInState(EMovementState.Attacking) &&
			this.States.IsMoving()
		);
	}

	public StopAllAnimations(speed?: number) {
		this.PrevAnimationStop = tick();
		this.PrevAnimationTimePosition = this.PrevAnimation !== undefined ? this.PrevAnimation.TimePosition : 0;
		this.RunFront.Stop(speed);
		/*this.RunFrontLeft.Stop(speed);
		this.RunFrontRight.Stop(speed);
		this.RunLeft.Stop(speed);
		this.RunRight.Stop(speed);*/
	}

	public Front() {
		if (this.RunFront.IsPlaying) return;
		this.RunFront.Play(FADE_IN, 1, this.AnimSpeed());
		this.RunFront.TimePosition = this.AnimTime(this.PrevAnimation === this.RunRight);
		this.PrevAnimation = this.RunFront;
	}

	public Direction() {
		if (!this.IsRunning || !this.IsRunningLocked || this.IsPaused) return;

		this.StopAllAnimations(FADE_OUT);
		if (this.RunDirection === Vector3.zero) return;

		switch (this.RunDirection) {
			case new Vector3(0, 0, -1): // Forward
				this.Front();
				break;
			case new Vector3(-1, 0, -1): // Front-Left
				this.Front();
				/*this.RunFrontLeft.Play(FADE_IN, 1, this.AnimSpeed());
				this.RunFrontLeft.TimePosition = this.AnimTime(this.PrevAnimation === this.RunRight);
				this.PrevAnimation = this.RunFrontLeft;*/
				break;
			case new Vector3(1, 0, -1): // Front-Right
				this.Front();
				// this.RunFrontRight.Play(FADE_IN, 1, this.AnimSpeed());
				// this.RunFrontRight.TimePosition = this.AnimTime(this.PrevAnimation === this.RunRight);
				// this.PrevAnimation = this.RunFrontRight;
				break;
			case new Vector3(1, 0, 0): // Right
				this.Front();
				// this.RunRight.Play(FADE_IN, 1, this.AnimSpeed());
				// this.RunRight.TimePosition = this.AnimTime(true);
				// this.PrevAnimation = this.RunRight;
				break;
			case new Vector3(-1, 0, 0): // Left
				this.Front();
				// this.RunLeft.Play(FADE_IN, 1, this.AnimSpeed());
				// this.RunLeft.TimePosition = this.AnimTime(this.PrevAnimation === this.RunRight);
				// this.PrevAnimation = this.RunLeft;
				break;
			case new Vector3(0, 0, 1): // Back
				this.RunStop();
				break;
			case new Vector3(-1, 0, 1): // Back-Left
				this.RunStop();
				break;
			case new Vector3(1, 0, 1): // Back-Right
				this.RunStop();
				break;
			default:
				this.StopAllAnimations(FADE_OUT);
				break;
		}
	}

	public AnimTime(normal: boolean = false): number {
		const TimeTick = tick() - this.PrevAnimationStop;

		if (this.PrevAnimation && TimeTick <= FADE_OUT) {
			let result: number;

			if (!normal) result = this.PrevAnimationTimePosition + TimeTick;
			else {
				if (TimeTick > DISTANCE) result = this.PrevAnimationTimePosition - DISTANCE + TimeTick;
				else result = this.PrevAnimationTimePosition + DISTANCE + TimeTick;
			}

			if (result > LIMIT) result = result - LIMIT;
			else if (result < 0) result = LIMIT - math.abs(result);

			return result;
		}

		return 0;
	}

	public AnimSpeed = () => (this.Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Run;

	public AttributeChanged(attribute: string) {
		if (attribute !== EAttribute.IsCameraLocked) return;

		if (!this.Attributes.IsCameraLocked()) {
			this.IsRunningLocked = false;
			this.StopAllAnimations(FADE_OUT);
			if (this.States.IsMoving() && this.CanRun()) {
				this.RunFront.Play(FADE_IN, 1, this.AnimSpeed());
				this.RunFront.TimePosition = this.AnimTime();
				this.PrevAnimation = this.RunFront;
			}
			return;
		}

		this.IsRunningLocked = true;
		this.Direction();
	}

	public CheckRun() {
		if (this.States.IsGrounded()) {
			if (this.CanRun()) this.States.SetState(EMovementState.Running, true);
			else this.Stop(EStopType.Stop);
		}
	}

	public MoveDirection(direction: Vector3) {
		if (this.RunDirection === direction) {
			this.CheckRun();
			return;
		}

		this.RunDirection = direction;
		this.CheckRun();
		this.Direction();
	}

	public RunSpeed() {
		this.RunFront.AdjustSpeed(this.AnimSpeed());
		/*this.RunFrontLeft.AdjustSpeed(this.AnimSpeed());
		this.RunFrontRight.AdjustSpeed(this.AnimSpeed());
		this.RunLeft.AdjustSpeed(this.AnimSpeed());
		this.RunRight.AdjustSpeed(this.AnimSpeed());*/
	}
}

export { Default_Hands_Run, Default_Hands_RunInfo };
