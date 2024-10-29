// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const Character = script.Parent!.Parent!.Parent as Model;
const Humanoid = Character.WaitForChild("Humanoid") as Humanoid;

const Guard = AnimManager.GetAnimation(Character, EAnimations.Guard);

let IsGuarding = false;

export = {
	Start() {
		if (IsGuarding || !Tools.IsTouchingGround(Humanoid)) return;
		IsGuarding = true;
		Guard.Play(0.35, 5, 1.5);
	},

	Stop() {
		if (!IsGuarding) return;
		IsGuarding = false;
		Guard.Stop(0.35);
	},
};
