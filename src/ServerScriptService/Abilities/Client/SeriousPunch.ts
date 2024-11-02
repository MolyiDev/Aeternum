// Imports
import { Players } from "@rbxts/services";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

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
