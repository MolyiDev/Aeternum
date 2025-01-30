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

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Walk}`;

const FADE_IN = 0.4;
const FADE_OUT = 0.4;
const ANIM_SPEED = 1.4;
const LIMIT = 1.32;
const DISTANCE = LIMIT / 2;

const IncludeStates = new Set<EMovementState>([
	EMovementState.Idle,
	EMovementState.Walking,
	EMovementState.Guarding,
	EMovementState.Blocking,
	EMovementState.Attacking,
]);

const Default_Hands_WalkInfo = {
	[EAnimations.Default_Hands_WalkFront]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkFrontLeft]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkFrontRight]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkBack]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkBackLeft]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkBackRight]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkLeft]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkRight]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[Style]: {
		Style: true,
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {
	ReplicateClass: "Footsteps",
})
class Default_Hands_Walk extends CStyle {
	private IsWalking: boolean = false;
	private IsWalkingLocked: boolean = false;

	private PrevAnimation: AnimationTrack | undefined;
	private PrevAnimationStop: number = 0;
	private PrevAnimationTimePosition: number = 0;
	private WalkDirection: Vector3 = Vector3.zero;

	private WalkFront: AnimationTrack;
	private WalkFrontLeft: AnimationTrack;
	private WalkFrontRight: AnimationTrack;
	private WalkBack: AnimationTrack;
	private WalkBackLeft: AnimationTrack;
	private WalkBackRight: AnimationTrack;
	private WalkLeft: AnimationTrack;
	private WalkRight: AnimationTrack;

	private Connections: RBXScriptConnection[];

	constructor(character: Character) {
		super(character);
		[
			this.WalkFront,
			this.WalkFrontLeft,
			this.WalkFrontRight,
			this.WalkBack,
			this.WalkBackLeft,
			this.WalkBackRight,
			this.WalkLeft,
			this.WalkRight,
		] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_WalkFront,
			EAnimations.Default_Hands_WalkFrontLeft,
			EAnimations.Default_Hands_WalkFrontRight,
			EAnimations.Default_Hands_WalkBack,
			EAnimations.Default_Hands_WalkBackLeft,
			EAnimations.Default_Hands_WalkBackRight,
			EAnimations.Default_Hands_WalkLeft,
			EAnimations.Default_Hands_WalkRight,
		);

		this.Connections = [
			this.Butler.Connect(this.Attributes.AttributeChanged, (attribute) => this.AttributeChanged(attribute)),
			this.Butler.Connect(this.Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => this.WalkSpeed()),
		];

		if (character.Player)
			this.Connections.push(
				this.Butler.Connect(this.ShiftLock.ChangedDirection, (direction) => this.MoveDirection(direction)),
			);
	}

	public Destroy() {
		this.Butler.RemoveList(this.Connections);
		this.Connections.clear();

		this.IsWalking = undefined!;
		this.IsWalkingLocked = undefined!;
		this.PrevAnimation = undefined!;
		this.PrevAnimationStop = undefined!;
		this.PrevAnimationTimePosition = undefined!;
		this.WalkDirection = undefined!;
		this.WalkFront = undefined!;
		this.WalkFrontLeft = undefined!;
		this.WalkFrontRight = undefined!;
		this.WalkBack = undefined!;
		this.WalkBackLeft = undefined!;
		this.WalkBackRight = undefined!;
		this.WalkLeft = undefined!;
		this.WalkRight = undefined!;
		this.Connections = undefined!;

		super.Destroy();
	}

	public Start() {
		if (this.IsWalking) return;
		this.IsWalking = true;

		if (this.Attributes.IsCameraLocked()) this.Direction();
		else {
			this.WalkFront.Play(FADE_IN, 1, this.AnimSpeed());
			this.WalkFront.TimePosition = this.AnimTime();
			this.PrevAnimation = this.WalkFront;
		}
	}

	public Stop(speed: number) {
		if (!this.IsWalking && !this.IsWalkingLocked) return;
		this.IsWalking = false;
		const Speed = speed ? speed : FADE_OUT;

		this.States.SetState(EMovementState.Walking, false);
		this.StopAllAnimations(Speed);
	}

	public StopAllAnimations(speed?: number) {
		this.PrevAnimationStop = tick();
		this.PrevAnimationTimePosition = this.PrevAnimation !== undefined ? this.PrevAnimation.TimePosition : 0;
		this.WalkFront.Stop(speed);
		this.WalkFrontLeft.Stop(speed);
		this.WalkFrontRight.Stop(speed);
		this.WalkBack.Stop(speed);
		this.WalkBackLeft.Stop(speed);
		this.WalkBackRight.Stop(speed);
		this.WalkRight.Stop(speed);
		this.WalkLeft.Stop(speed);
	}

	public Direction() {
		if (!this.IsWalking || !this.IsWalkingLocked) return;

		this.StopAllAnimations(FADE_OUT);
		if (this.WalkDirection === Vector3.zero) return;

		switch (this.WalkDirection) {
			case new Vector3(0, 0, -1): // Forward
				if (this.WalkFront.IsPlaying) return;
				this.WalkFront.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkFront.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkFront;
				break;
			case new Vector3(-1, 0, -1): // Front-Left
				this.WalkFrontLeft.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkFrontLeft.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkFrontLeft;
				break;
			case new Vector3(1, 0, -1): // Front-Right
				this.WalkFrontRight.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkFrontRight.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkFrontRight;
				break;
			case new Vector3(0, 0, 1): // Back
				this.WalkBack.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkBack.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkBack;
				break;
			case new Vector3(-1, 0, 1): // Back-Left
				this.WalkBackLeft.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkBackLeft.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkBackLeft;
				break;
			case new Vector3(1, 0, 1): // Back-Right
				this.WalkBackRight.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkBackRight.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkBackRight;
				break;
			case new Vector3(1, 0, 0): // Right
				this.WalkRight.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkRight.TimePosition = this.AnimTime(true);
				this.PrevAnimation = this.WalkRight;
				break;
			case new Vector3(-1, 0, 0): // Left
				this.WalkLeft.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkLeft.TimePosition = this.AnimTime(this.PrevAnimation === this.WalkRight);
				this.PrevAnimation = this.WalkLeft;
				break;
			default:
				this.StopAllAnimations(FADE_OUT);
				break;
		}
	}

	public CanWalk = () =>
		this.States.IsMoving() && !this.Attributes.IsStunned() && IncludeStates.has(this.States.State);

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

	public AnimSpeed = () => (this.Humanoid.WalkSpeed * ANIM_SPEED) / EMovementSpeeds.Default;

	public AttributeChanged(attribute: string) {
		if (attribute !== EAttribute.IsCameraLocked) return;

		if (!this.Attributes.IsCameraLocked()) {
			this.IsWalkingLocked = false;
			this.StopAllAnimations(FADE_OUT);
			if (this.States.IsMoving() && this.CanWalk()) {
				this.WalkFront.Play(FADE_IN, 1, this.AnimSpeed());
				this.WalkFront.TimePosition = this.AnimTime();
				this.PrevAnimation = this.WalkFront;
			}
			return;
		}

		this.IsWalkingLocked = true;
		this.Direction();
	}

	public CheckWalk() {
		if (!this.States.IsInState(EMovementState.Running) && this.States.IsGrounded()) {
			if (this.CanWalk()) this.States.SetState(EMovementState.Walking, true);
			else {
				this.Stop(FADE_OUT);
				this.States.SetState(EMovementState.Walking, false);
			}
		}
	}

	public MoveDirection(direction: Vector3) {
		if (this.WalkDirection === direction) {
			this.CheckWalk();
			return;
		}

		this.WalkDirection = direction;
		this.CheckWalk();
		this.Direction();
	}

	public WalkSpeed() {
		this.WalkFront.AdjustSpeed(this.AnimSpeed());
		this.WalkFrontRight.AdjustSpeed(this.AnimSpeed());
		this.WalkFrontLeft.AdjustSpeed(this.AnimSpeed());
		this.WalkBack.AdjustSpeed(this.AnimSpeed());
		this.WalkBackRight.AdjustSpeed(this.AnimSpeed());
		this.WalkBackLeft.AdjustSpeed(this.AnimSpeed());
		this.WalkLeft.AdjustSpeed(this.AnimSpeed());
		this.WalkRight.AdjustSpeed(this.AnimSpeed());
	}
}

export { Default_Hands_Walk, Default_Hands_WalkInfo };
