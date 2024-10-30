/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players } from "@rbxts/services";
import { Tools } from "shared/Libraries/Tools";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAnimations } from "shared/Enums/EAnimations";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const [WalkJump, RunJump, DoubleJump] = Animations.GetAnimations(
	EAnimations.WalkJump,
	EAnimations.RunJump,
	EAnimations.DoubleJump,
);

const DOUBLEJUMP_FORCE_UP = 85;

let JumpType = "Forward";
let DoubleJumped = false;

export class JumpManager {
	public static JumpActivate() {
		if (StateManager.IsInState(EMovementState.Running)) RunJump.Play(0.15, 2, 1.5);
		else WalkJump.Play(0.15);
	}

	public static DoubleJumpStart() {
		if (Tools.IsTouchingGround(Humanoid)) return;
		if (DoubleJumped) return;
		DoubleJumped = true;

		const direction = HumanoidRootPart.CFrame.VectorToObjectSpace(Humanoid.MoveDirection);
		if (direction.Z <= 0) {
			JumpType = "Forward";
			DoubleJump.Play(0.15, 1);
		} else {
			JumpType = "Back";
			DoubleJump.Play(0.15, 1, -1);
		}

		Humanoid.ChangeState(Enum.HumanoidStateType.Physics);

		HumanoidRootPart.AssemblyLinearVelocity = new Vector3(
			HumanoidRootPart.AssemblyLinearVelocity.X,
			DOUBLEJUMP_FORCE_UP,
			HumanoidRootPart.AssemblyLinearVelocity.Z,
		);

		task.wait(0.15);
		Humanoid.ChangeState(Enum.HumanoidStateType.Running);
	}

	public static JumpDeactivate(speed: number | undefined) {
		const Speed = speed ? speed : 0.225;
		StateManager.SetState(EMovementState.Jumping, false);
		WalkJump.Stop(Speed);
		RunJump.Stop(Speed);
		DoubleJump.Stop(Speed);
		if (DoubleJumped && Tools.IsTouchingGround(Humanoid)) DoubleJumped = false;
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	switch (newState) {
		case Enum.HumanoidStateType.Jumping:
			StateManager.SetState(EMovementState.Jumping, true);
			break;
		default:
			StateManager.SetState(EMovementState.Jumping, false);
			break;
	}
}

Butler.Connect(Humanoid.StateChanged, (oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
	StateChanged(oldState, newState),
);

Butler.Connect(WalkJump.GetMarkerReachedSignal("End"), () => WalkJump.Stop(0.2));
Butler.Connect(RunJump.GetMarkerReachedSignal("End"), () => RunJump.Stop(0.2));
Butler.Connect(DoubleJump.GetMarkerReachedSignal("EndForward"), () => {
	if (JumpType !== "Forward") return;
	DoubleJump.Stop(0.3);
});
Butler.Connect(DoubleJump.GetMarkerReachedSignal("EndBack"), () => {
	if (JumpType !== "Back") return;
	DoubleJump.Stop(0.3);
});
