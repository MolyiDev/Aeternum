import { Players, RunService } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Butler = Character.Butler;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const RootJoint = Character.Model.LowerTorso.WaitForChild("Root") as AnimationConstraint;
const RootJointPosition = RootJoint.Attachment0!.CFrame;

const ROLL_ANGLE = math.rad(5);
const PITCH_ANGLE = math.rad(5);
const LEAN_SPEED = 5;

Butler.Connect(RunService.Stepped, (_, dt) => {
	const MoveVelocity = Humanoid.GetMoveVelocity();
	const RelativeVelocity = HumanoidRootPart.CFrame.VectorToObjectSpace(MoveVelocity);

	let pitch = 0;
	let roll = 0;

	if (Humanoid.WalkSpeed !== 0) {
		pitch = math.clamp(RelativeVelocity.Z / Humanoid.WalkSpeed, -1, 1) * PITCH_ANGLE;
		roll = -math.clamp(RelativeVelocity.X / Humanoid.WalkSpeed, -1, 1) * ROLL_ANGLE;
	}

	RootJoint.Attachment0!.CFrame = RootJoint.Attachment0!.CFrame.Lerp(
		RootJointPosition.mul(CFrame.Angles(pitch, 0, roll)),
		math.min(dt * LEAN_SPEED, 1),
	);
});
