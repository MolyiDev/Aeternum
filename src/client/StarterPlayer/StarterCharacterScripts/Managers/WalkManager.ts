/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { Tools } from "shared/Libraries/Tools";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAttribute } from "shared/Enums/EAttribute";
import { EAnimations } from "shared/Enums/EAnimations";

// Constants
const FADE_IN = 0.25;
const FADE_OUT = 0.25;

const FORWARD_SPEED = 1.4;
const BACK_SPEED = -1.4;
const RIGHT_SPEED = 1.25;
const LEFT_SPEED = 1.25;

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
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const [WalkForward, WalkBack, WalkRight, WalkLeft] = Animations.GetAnimations(
	EAnimations.WalkForward,
	EAnimations.WalkBack,
	EAnimations.WalkRight,
	EAnimations.WalkLeft,
);

let IsWalking = false;
let IsWalkingLocked = false;

export class WalkManager {
	public static WalkDirection: Vector3 = Vector3.zero;

	public static WalkDeactivate(speed: number | undefined) {
		if (!IsWalking && !IsWalkingLocked) return;
		IsWalking = false;
		const Speed = speed ? speed : FADE_OUT;

		StateManager.SetState(EMovementState.Walking, false);
		WalkForward.Stop(Speed);
		WalkBack.Stop(Speed);
		WalkLeft.Stop(Speed);
		WalkRight.Stop(Speed);
	}

	public static WalkActivate() {
		if (IsWalking) return;
		IsWalking = true;

		if (Attributes.IsCameraLocked()) this.Direction();
		else WalkForward.Play(FADE_IN, 1, this.AnimForwardSpeed());
	}

	public static Direction() {
		if (!IsWalking || !IsWalkingLocked) return;

		if (this.WalkDirection === Vector3.zero) {
			WalkForward.Stop(FADE_OUT);
			WalkBack.Stop(FADE_OUT);
			WalkLeft.Stop(FADE_OUT);
			WalkRight.Stop(FADE_OUT);
			return;
		}

		switch (this.WalkDirection.Z) {
			case -1:
				if (!WalkForward.IsPlaying) WalkForward.Play(FADE_IN, 1, this.AnimForwardSpeed());
				if (WalkBack.IsPlaying) WalkBack.Stop(FADE_OUT);
				break;
			case 1:
				if (!WalkBack.IsPlaying) WalkBack.Play(FADE_IN, 1, this.AnimBackSpeed());
				if (WalkForward.IsPlaying) WalkForward.Stop(FADE_OUT);
				break;
			default:
				if (WalkForward.IsPlaying) WalkForward.Stop(FADE_OUT);
				if (WalkBack.IsPlaying) WalkBack.Stop(FADE_OUT);
				break;
		}

		switch (this.WalkDirection.X) {
			case 1:
				if (!WalkRight.IsPlaying) WalkRight.Play(FADE_IN, 1, this.AnimRightSpeed());
				if (WalkLeft.IsPlaying) WalkLeft.Stop(FADE_OUT);
				break;
			case -1:
				if (!WalkLeft.IsPlaying) WalkLeft.Play(FADE_IN, 1, this.AnimLeftSpeed());
				if (WalkRight.IsPlaying) WalkRight.Stop(FADE_OUT);
				break;
			default:
				if (WalkLeft.IsPlaying) WalkLeft.Stop(FADE_OUT);
				if (WalkRight.IsPlaying) WalkRight.Stop(FADE_OUT);
				break;
		}
	}

	public static CanWalk() {
		return StateManager.IsMoving() && !Attributes.IsStunned() && IncludeStates.has(StateManager.State);
	}

	public static AnimForwardSpeed = () => (Humanoid.WalkSpeed * FORWARD_SPEED) / EMovementSpeeds.Default;

	public static AnimBackSpeed = () => (Humanoid.WalkSpeed * BACK_SPEED) / EMovementSpeeds.Default;

	public static AnimLeftSpeed = () => (Humanoid.WalkSpeed * LEFT_SPEED) / EMovementSpeeds.Default;

	public static AnimRightSpeed = () => (Humanoid.WalkSpeed * RIGHT_SPEED) / EMovementSpeeds.Default;
}

function AttributeChanged(attribute: string) {
	if (attribute !== EAttribute.IsCameraLocked) return;

	if (!Attributes.IsCameraLocked()) {
		IsWalkingLocked = false;
		if (StateManager.IsMoving() && !WalkForward.IsPlaying && WalkManager.CanWalk())
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
	if (!StateManager.IsInState(EMovementState.Running) && Tools.IsTouchingGround(Humanoid)) {
		if (WalkManager.CanWalk()) StateManager.SetState(EMovementState.Walking, true);
		else StateManager.SetState(EMovementState.Walking, false);
	}
}

function MoveDirection() {
	const direction = Tools.WorldMovingDirection(HumanoidRootPart.CFrame.VectorToObjectSpace(Humanoid.MoveDirection));
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
Butler.Connect(Humanoid.GetPropertyChangedSignal("MoveDirection"), () => MoveDirection());
Butler.Connect(HumanoidRootPart.GetPropertyChangedSignal("CFrame"), () => MoveDirection());
Butler.Connect(Humanoid.GetPropertyChangedSignal("WalkSpeed"), () => WalkSpeed());
