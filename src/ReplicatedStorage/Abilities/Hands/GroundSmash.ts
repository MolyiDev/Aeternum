// Imports
import { AbilityInfo } from "ReplicatedStorage/Attributes/AbilityInfo";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { CAbility } from "ReplicatedStorage/Classes/Abstracts/CAbility";

const Ability = EAbility.GroundSmash;
const Cooldown = 5;

const GroundSmashInfo = {
	[EAnimations.GroundSmash]: {
		CanFeint: true,
		Sound: true,
		HasFeintStop: true,
		Cooldown: Cooldown,
		AbilityClass: Ability,
	},
	[EAnimations.GroundSmashIdle]: {
		CanFeint: true,
		HasFeintStop: false,
		Sound: true,
		Cooldown: Cooldown,
		AbilityClass: Ability,
	},
	[EAnimations.GroundSmashLand]: {
		HasFeintStop: false,
		Sound: true,
		Cooldown: Cooldown,
		AbilityClass: Ability,
	},
};

@AbilityInfo(Ability, {
	Weapon: EWeapon.Hands,
	Cooldown: Cooldown,
	Damage: [50, 30, 10],
	Blockeable: true,
	PerfectBlockeable: true,
	Dasheable: true,
})
class GroundSmash extends CAbility {
	public Start() {
		if (this.Attributes.IsStunned()) return;
		this.FireSignal();
	}
}

export { GroundSmash, GroundSmashInfo };
