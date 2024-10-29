/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Tools } from "shared/Libraries/Tools";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { EMovementJumps } from "shared/Enums/Movement/EMovementJumps";
import { AttributeManager } from "shared/Managers/AttributeManager";
import { ITweenManager } from "../Interfaces/ITweenManager";
import { IModel } from "shared/Interfaces/IModel";
import { AnimManager } from "shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";

// Variables
const Character = script.Parent!.Parent!.Parent as IModel;
const Humanoid = Character.WaitForChild("Humanoid") as Humanoid;

const Scripts = Character.WaitForChild("Scripts");
const Managers = Scripts.WaitForChild("Managers");
const TweenModule = require(Managers.WaitForChild("TweenModule") as ModuleScript) as ITweenManager;

const Block = AnimManager.GetAnimation(Character, EAnimations.Block);

let IsBlocking = false;

export = {
	Start() {
		if (IsBlocking || AttributeManager.IsStunnedFull(Character) || !Tools.IsTouchingGround(Humanoid)) return;
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
