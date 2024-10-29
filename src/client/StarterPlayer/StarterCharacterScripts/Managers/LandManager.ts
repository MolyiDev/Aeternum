// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "./StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EStunType } from "shared/Enums/EStunType";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";

// States
const IncludeStates = new Set<EMovementState>([]);
const ExcludeStates = new Set<EMovementState>([EMovementState.Sliding]);

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const HumanoidRootPart = Character.HumanoidRootPart;
const Janitor = Character.Janitor;

const [LandShort, LandLarge] = AnimManager.GetAnimations(Character, EAnimations.LandShort, EAnimations.LandLarge);

const LANDING_LARGE_HEIGHT = -160;

export class LandManager {
	public static LandingShortStart() {
		if (StateManager.IsInState(EMovementState.Sliding)) return;
		LandShort.Play(0.1, 2, 1.35);
	}

	public static LandingLargeStart() {
		Attributes.SelfStun(1.5, EStunType.Default);
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
		StateManager.SetState(EMovementState.Landing, true);
	} else StateManager.SetState(EMovementState.Landing, false);
}

Janitor.Add(
	Humanoid.StateChanged.Connect((oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) =>
		StateChanged(oldState, newState),
	),
);

Janitor.Add(LandShort.GetMarkerReachedSignal("End").Connect(() => LandShort.Stop(0.25)));
Janitor.Add(LandLarge.GetMarkerReachedSignal("End").Connect(() => LandLarge.Stop(0.35)));
