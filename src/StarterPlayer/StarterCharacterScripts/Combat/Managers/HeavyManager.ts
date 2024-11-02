// Imports
import { Players } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { StateManager } from "../../Managers/StateManager";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { GuardManager } from "./GuardManager";

// Constants
const HEAVYPUNCH_CD = 7.5;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Butler = Character.Butler;

const HeavyPunch = Animations.GetAnimation(EAnimations.HeavyPunch);

let CanHeavyPunch = true;

export class HeavyManager {
	public static Attack() {
		if (Attributes.IsStunned() || !CanHeavyPunch || StateManager.IsInState(EMovementState.Attacking)) return;

		CanHeavyPunch = false;
		HeavyPunch.Play(0.15);
		delay(HEAVYPUNCH_CD, () => (CanHeavyPunch = true));
	}
}

Butler.Connect(HeavyPunch.GetMarkerReachedSignal("End"), () => GuardManager.Start());
