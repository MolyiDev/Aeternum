// Imports
import { Players } from "@rbxts/services";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { StateManager } from "../../Managers/StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { GuardManager } from "./GuardManager";

// Constants
const HEAVYPUNCH_CD = 7.5;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;
const Janitor = Character.Janitor;

const HeavyPunch = AnimManager.GetAnimation(Character, EAnimations.HeavyPunch);

let CanHeavyPunch = true;

export class HeavyManager {
	public static Attack() {
		if (Attributes.IsStunned() || !CanHeavyPunch || StateManager.IsInState(EMovementState.Attacking)) return;

		CanHeavyPunch = false;
		HeavyPunch.Play(0.15);
		delay(HEAVYPUNCH_CD, () => (CanHeavyPunch = true));
	}
}

Janitor.Add(HeavyPunch.GetMarkerReachedSignal("End").Connect(() => GuardManager.Start()));
