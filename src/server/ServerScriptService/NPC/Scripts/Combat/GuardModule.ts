// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const Character = CharacterManager.GetCharacter(script.Parent!.Parent!.Parent)!;
const Animations = Character.Animations;
const Humanoid = Character.Humanoid;

const Guard = Animations.GetAnimation(EAnimations.Guard);

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
