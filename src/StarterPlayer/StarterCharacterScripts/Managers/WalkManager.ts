/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { ShiftLockHandler } from "../Handlers/ShiftLockHandler";

// Constants
const FADE_IN = 0.3;
const FADE_OUT = 0.3;

const FORWARD_SPEED = 1.4;
const FORWARD_DIAGONAL_SPEED = 1.4;
const BACK_SPEED = -1.4;
const BACK_DIAGONAL_SPEED = -1.4;
const RIGHT_SPEED = 1.4;
const LEFT_SPEED = 1.4;

// States
const IncludeStates = new Set<EMovementState>([
	EMovementState.Idle,
	EMovementState.Walking,
	EMovementState.Guarding,
	EMovementState.Blocking,
	EMovementState.Attacking,
]);
const ExcludeStates = new Set<EMovementState>([]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

const [WalkForward, WalkForwardLeft, WalkForwardRight, WalkBack, WalkBackLeft, WalkBackRight, WalkRight, WalkLeft] =
	Animations.GetAnimations(
		EAnimations.WalkForward,
		EAnimations.WalkForwardLeft,
		EAnimations.WalkForwardRight,
		EAnimations.WalkBack,
		EAnimations.WalkBackLeft,
		EAnimations.WalkBackRight,
		EAnimations.WalkRight,
		EAnimations.WalkLeft,
	);

let IsWalking = false;
let IsWalkingLocked = false;

export class WalkManager {
	private static PrevAnimation: AnimationTrack | undefined;
	public static WalkDirection: Vector3 = Vector3.zero;

	public static WalkDeactivate(speed: number | undefined) {
		if (!IsWalking && !IsWalkingLocked) return;
		IsWalking = false;
		const Speed = speed ? speed : FADE_OUT;

		States.SetState(EMovementState.Walking, false);
		this.StopAllAnimations(Speed);
	}

	public static WalkActivate() {
		if (IsWalking) return;
		IsWalking = true;

		if (Attributes.IsCameraLocked()) this.Direction();
		else WalkForward.Play(FADE_IN, 1, this.AnimForwardSpeed());
	}

	private static StopAllAnimations(speed?: number) {
		this.PrevAnimation = undefined;
		WalkForward.Stop(speed);
		WalkForwardLeft.Stop(speed);
		WalkForwardRight.Stop(speed);
		WalkBack.Stop(speed);
		WalkBackLeft.Stop(speed);
		WalkBackRight.Stop(speed);
		WalkRight.Stop(speed);
		WalkLeft.Stop(speed);
	}

	public static Direction() {
		if (!IsWalking || !IsWalkingLocked) return;

		if (this.WalkDirection === Vector3.zero) {
			this.StopAllAnimations(FADE_OUT);
			return;
		}

		const Time = this.PrevAnimation !== undefined ? this.PrevAnimation.TimePosition : 0;
		this.StopAllAnimations(FADE_OUT);

		switch (this.WalkDirection) {
			case new Vector3(0, 0, -1): // Forward
				WalkForward.Play(FADE_IN, 1, this.AnimForwardSpeed());
				WalkForward.TimePosition = Time;
				this.PrevAnimation = WalkForward;
				break;
			case new Vector3(-1, 0, -1): // Forward-Left
				WalkForwardLeft.Play(FADE_IN, 1, this.AnimForwardDiagonalSpeed());
				WalkForwardLeft.TimePosition = Time;
				this.PrevAnimation = WalkForwardLeft;
				break;
			case new Vector3(1, 0, -1): // Forward-Right
				WalkForwardRight.Play(FADE_IN, 1, this.AnimForwardDiagonalSpeed());
				WalkForwardRight.TimePosition = Time;
				this.PrevAnimation = WalkForwardRight;
				break;
			case new Vector3(0, 0, 1): // Back
				WalkBack.Play(FADE_IN, 1, this.AnimBackSpeed());
				WalkBack.TimePosition = Time;
				this.PrevAnimation = WalkBack;
				break;
			case new Vector3(-1, 0, 1): // Back-Left
				WalkBackLeft.Play(FADE_IN, 1, this.AnimBackDiagonalSpeed());
				WalkBackLeft.TimePosition = Time;
				this.PrevAnimation = WalkBackLeft;
				break;
			case new Vector3(1, 0, 1): // Back-Right
				WalkBackRight.Play(FADE_IN, 1, this.AnimBackDiagonalSpeed());
				WalkBackRight.TimePosition = Time;
				this.PrevAnimation = WalkBackRight;
				break;
			case new Vector3(1, 0, 0): // Right
				WalkRight.Play(FADE_IN, 1, this.AnimRightSpeed());
				WalkRight.TimePosition = Time;
				this.PrevAnimation = WalkRight;
				break;
			case new Vector3(-1, 0, 0): // Left
				WalkLeft.Play(FADE_IN, 1, this.AnimLeftSpeed());
				WalkLeft.TimePosition = Time;
				this.PrevAnimation = WalkLeft;
				break;
			default:
				this.StopAllAnimations(FADE_OUT);
				break;
		}
	}

	public static CanWalk = () => States.IsMoving() && !Attributes.IsStunned() && IncludeStates.has(States.State);

	public static AnimForwardSpeed = () => (Humanoid.WalkSpeed * FORWARD_SPEED) / EMovementSpeeds.Default;

	public static AnimForwardDiagonalSpeed = () =>
		(Humanoid.WalkSpeed * FORWARD_DIAGONAL_SPEED) / EMovementSpeeds.Default;

	public static AnimBackSpeed = () => (Humanoid.WalkSpeed * BACK_SPEED) / EMovementSpeeds.Default;

	public static AnimBackDiagonalSpeed = () => (Humanoid.WalkSpeed * BACK_DIAGONAL_SPEED) / EMovementSpeeds.Default;

	public static AnimLeftSpeed = () => (Humanoid.WalkSpeed * LEFT_SPEED) / EMovementSpeeds.Default;

	public static AnimRightSpeed = () => (Humanoid.WalkSpeed * RIGHT_SPEED) / EMovementSpeeds.Default;
}

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsCameraLocked) return;

	if (!Attributes.IsCameraLocked()) {
		IsWalkingLocked = false;
		if (States.IsMoving() && !WalkForward.IsPlaying && WalkManager.CanWalk())
			WalkForward.Play(FADE_IN, 1, WalkManager.AnimForwardSpeed());
		if (WalkBack.IsPlaying) WalkBack.Stop(FADE_OUT);
		if (WalkLeft.IsPlaying) WalkLeft.Stop(FADE_OUT);
		if (WalkRight.IsPlaying) WalkRight.Stop(FADE_OUT);
		return;
	}

	IsWalkingLocked = true;
	WalkManager.Direction();
}

function CheckWalk() {
	if (!States.IsInState(EMovementState.Running) && Tools.IsTouchingGround(Humanoid)) {
		if (WalkManager.CanWalk()) States.SetState(EMovementState.Walking, true);
		else {
			WalkManager.WalkDeactivate(FADE_OUT);
			States.SetState(EMovementState.Walking, false);
		}
	}
}

function MoveDirection(direction: Vector3) {
	if (WalkManager.WalkDirection === direction) {
		CheckWalk();
		return;
	}

	WalkManager.WalkDirection = direction;
	CheckWalk();
	WalkManager.Direction();
}

function WalkSpeed() {
	WalkForward.AdjustSpeed(WalkManager.AnimForwardSpeed());
	WalkLeft.AdjustSpeed(WalkManager.AnimLeftSpeed());
	WalkRight.AdjustSpeed(WalkManager.AnimRightSpeed());
	WalkBack.AdjustSpeed(WalkManager.AnimBackSpeed());
}

Butler.Connect(Attributes.AttributeChanged, (attribute) => AttributeChanged(attribute));
Butler.Connect(ShiftLockHandler.ChangedDirection, (direction) => MoveDirection(direction));
Butler.Connect(Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => WalkSpeed());
