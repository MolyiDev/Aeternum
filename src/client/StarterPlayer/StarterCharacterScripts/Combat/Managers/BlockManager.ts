// Imports
import { Players } from "@rbxts/services";
import { StateManager } from "../../Managers/StateManager";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { EMovementJumps } from "shared/Enums/Movement/EMovementJumps";
import { TweenManager } from "../../Managers/TweenManager";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Attributes = Character.Attributes;

const Block = AnimManager.GetAnimation(Character, EAnimations.Block);

let IsBlocking = false;

export class BlockManager {
	public static Start() {
		if (IsBlocking || Attributes.IsStunned()) return;
		IsBlocking = true;
		TweenManager.SetSpeed(EMovementSpeeds.Blocking, 0.25);
		TweenManager.SetJump(EMovementJumps.Blocking, 0.25);
		StateManager.SetState(EMovementState.Blocking, true);
		Block.Play(0.175, 1, 1.4);
	}

	public static Stop() {
		if (!IsBlocking) return;
		IsBlocking = false;
		TweenManager.SetSpeed(EMovementSpeeds.Default, 0.25);
		TweenManager.SetJump(EMovementJumps.Default, 0.25);
		StateManager.SetState(EMovementState.Blocking, false);
		Block.Stop(0.175);
	}
}
