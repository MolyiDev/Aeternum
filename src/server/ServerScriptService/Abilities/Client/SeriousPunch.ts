// Imports
import { Players } from "@rbxts/services";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAnimations } from "shared/Enums/EAnimations";
import { EStunType } from "shared/Enums/EStunType";
import { IModel } from "shared/Interfaces/IModel";
import { Tools } from "shared/Libraries/Tools";
import { AnimManager } from "shared/Managers/AnimManager";
import { AttributeManager } from "shared/Managers/AttributeManager";

// Variables
const Player = Players.LocalPlayer;
const Character = (Player.Character ?? Player.CharacterAdded.Wait()[0]) as IModel;
const Humanoid = Character.WaitForChild("Humanoid") as Humanoid;

const SeriousPunch = AnimManager.GetAnimation(Character, EAnimations.SeriousPunch);

const Ability = EAbility.SeriousPunch;

export = {
	Start() {
		if (AttributeManager.IsStunned(Character) || !Tools.IsTouchingGround(Humanoid, true)) return;

		AttributeManager.SelfStun(Character, 1.45, EStunType.Partial);
		SeriousPunch.Play();
	},

	GetAbility() {
		return Ability;
	},
};
