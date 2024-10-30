// Imports
import { RunService, TweenService } from "@rbxts/services";
import { EMovementJumps } from "shared/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const Character = CharacterManager.GetCharacter(script.Parent!.Parent!.Parent)!;
const Humanoid = Character.Humanoid;
const Butler = Character.Butler;

Humanoid.WalkSpeed = EMovementSpeeds.Default;
Humanoid.JumpPower = EMovementJumps.Default;

let HeartbeatConnection: RBXScriptConnection | undefined;

let TargetSpeed = EMovementSpeeds.Default;
let TargetJump = EMovementJumps.Default;

let InitialSpeed = EMovementSpeeds.Default;
let InitialJump = EMovementJumps.Default;

let InfoSpeed = new TweenInfo(0);
let InfoJump = new TweenInfo(0);

let TimeElapsedSpeed = 0;
let TimeElapsedJump = 0;

let IsPaused = false;

function Hearbeat(deltaTime: number) {
	if (IsPaused) return;
	TimeElapsedSpeed = math.min(TimeElapsedSpeed + deltaTime, InfoSpeed.Time);
	TimeElapsedJump = math.min(TimeElapsedJump + deltaTime, InfoJump.Time);

	if (InfoSpeed.Time > 0) {
		const alphaSpeed = TimeElapsedSpeed / InfoSpeed.Time;
		const easedAlphaSpeed = TweenService.GetValue(alphaSpeed, InfoSpeed.EasingStyle, InfoSpeed.EasingDirection);
		Humanoid.WalkSpeed = InitialSpeed + (TargetSpeed - InitialSpeed) * easedAlphaSpeed;
	}

	if (InfoJump.Time > 0) {
		const alphaJump = TimeElapsedJump / InfoJump.Time;
		const easedAlphaJump = TweenService.GetValue(alphaJump, InfoJump.EasingStyle, InfoJump.EasingDirection);
		Humanoid.JumpPower = InitialJump + (TargetJump - InitialJump) * easedAlphaJump;
	}

	if (TimeElapsedSpeed === InfoSpeed.Time && TimeElapsedJump === InfoJump.Time) {
		if (HeartbeatConnection) Butler.Remove(HeartbeatConnection);
		HeartbeatConnection = undefined;
	}
}

export = {
	Pause() {
		IsPaused = true;
	},
	Resume() {
		IsPaused = false;
	},

	SetSpeed(speed: number, time: number) {
		InitialSpeed = Humanoid.WalkSpeed;
		TargetSpeed = speed;
		InfoSpeed = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		TimeElapsedSpeed = 0;
		this.Resume();
		if (!HeartbeatConnection) HeartbeatConnection = Butler.Connect(RunService.Heartbeat, (dt) => Hearbeat(dt));
	},

	SetJump(jump: number, time: number) {
		InitialJump = Humanoid.JumpPower;
		TargetJump = jump;
		InfoJump = new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		TimeElapsedJump = 0;
		this.Resume();
		if (!HeartbeatConnection) HeartbeatConnection = Butler.Connect(RunService.Heartbeat, (dt) => Hearbeat(dt));
	},
};
