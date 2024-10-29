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

const [GroundSmash, GroundSmashIdle, GroundSmashLand] = AnimManager.GetAnimations(
	Character,
	EAnimations.GroundSmash,
	EAnimations.GroundSmashIdle,
	EAnimations.GroundSmashLand,
);

const Ability = EAbility.GroundSmash;

export = {
	Start() {
		if (AttributeManager.IsStunned(Character)) return;
		if (!Tools.IsTouchingGround(Humanoid, true)) {
			GroundSmashIdle.Play();
		} else {
			AttributeManager.SelfStun(Character, 0.5, EStunType.Partial);
			GroundSmash.Play();
		}
	},

	GetAbility() {
		return Ability;
	},
};
