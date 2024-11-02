/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { ITweenManager } from "../Interfaces/ITweenManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const Character = CharacterManager.GetCharacter(script.Parent!.Parent!.Parent)!;
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;
const Model = Character.Model;

const Block = Animations.GetAnimation(EAnimations.Block);

let IsBlocking = false;

// Requires
const Scripts = Model.WaitForChild("Scripts");
const Managers = Scripts.WaitForChild("Managers");
const TweenModule = require(Managers.WaitForChild("TweenModule") as ModuleScript) as ITweenManager;

export = {
	Start() {
		if (IsBlocking || Attributes.IsStunnedFull() || !Tools.IsTouchingGround(Humanoid)) return;
		IsBlocking = true;
		TweenModule.SetSpeed(EMovementSpeeds.Blocking, 0.25);
		TweenModule.SetJump(EMovementJumps.Blocking, 0.25);
		Block.Play(0.175, 1, 1.4);
	},

	Stop() {
		if (!IsBlocking) return;
		IsBlocking = false;
		TweenModule.SetSpeed(EMovementSpeeds.Default, 0.25);
		TweenModule.SetJump(EMovementJumps.Default, 0.25);
		Block.Stop(0.175);
	},
};
