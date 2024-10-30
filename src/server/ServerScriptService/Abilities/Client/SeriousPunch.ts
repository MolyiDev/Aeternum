// Imports
import { Players } from "@rbxts/services";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAnimations } from "shared/Enums/EAnimations";
import { EStunType } from "shared/Enums/EStunType";
import { Tools } from "shared/Libraries/Tools";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Attributes = Character.Attributes;
const Humanoid = Character.Humanoid;

const SeriousPunch = Animations.GetAnimation(EAnimations.SeriousPunch);

const Ability = EAbility.SeriousPunch;

export = {
	Start() {
		if (Attributes.IsStunned() || !Tools.IsTouchingGround(Humanoid, true)) return;

		Attributes.SelfStun(1.45, EStunType.Partial);
		SeriousPunch.Play();
	},

	GetAbility() {
		return Ability;
	},
};
