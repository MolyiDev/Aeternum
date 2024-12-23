/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Players } from "@rbxts/services";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([]);
const ExcludeStates = new Set<EMovementState>([EMovementState.Sliding]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const States = Character.States;
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Butler = Character.Butler;

const [LandShort, LandLarge] = Animations.GetAnimations(EAnimations.LandShort, EAnimations.LandLarge);

const LANDING_LARGE_HEIGHT = -160;

export class LandManager {
	public static LandingShortStart() {
		if (States.IsInState(EMovementState.Sliding)) return;
		LandShort.Play(0.1, 2, 1.35);
	}

	public static LandingLargeStart() {
		if (!Attributes.CanLandStun()) return;

		Attributes.SelfStun(1.5, EStunType.Full);
		LandLarge.Play(0.1, 5);
	}

	public static LandDeactivate(speed: number | undefined) {
		if (LandLarge.IsPlaying) return;
		const Speed = speed ? speed : 0.1;
		LandShort.Stop(Speed);
	}

	public static LandActivate() {
		if (HumanoidRootPart.AssemblyLinearVelocity.Y < LANDING_LARGE_HEIGHT) LandManager.LandingLargeStart();
		else LandManager.LandingShortStart();
	}
}

function StateChanged(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) {
	if (newState === Enum.HumanoidStateType.Landed) {
		LandManager.LandActivate();
		States.SetState(EMovementState.Landing, true);
	} else States.SetState(EMovementState.Landing, false);
}

Butler.Connect(Humanoid.StateChanged, (oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
	StateChanged(oldState, newState),
);

Butler.Connect(LandShort.GetMarkerReachedSignal("End"), () => LandShort.Stop(0.25));
Butler.Connect(LandLarge.GetMarkerReachedSignal("End"), () => LandLarge.Stop(0.35));
