// Imports
import { AbilityInfo } from "ReplicatedStorage/Attributes/AbilityInfo";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { CAbility } from "ReplicatedStorage/Classes/Abstracts/CAbility";

const Ability = EAbility.ElectricKick;
const Cooldown = 5;

const ElectricKickInfo = {
	[EAnimations.ElectricKick]: {
		CanFeint: true,
		HasFeintStop: true,
		Signal: true,
		Sound: true,
		Cooldown: Cooldown,
		AbilityClass: Ability,
	},
};

@AbilityInfo(Ability, {
	Weapon: EWeapon.Hands,
	Cooldown: Cooldown,
	Damage: [10, 10, 20],
	PerfectBlockeable: true,
	Blockeable: true,
	Dasheable: true,
})
class ElectricKick extends CAbility {
	public Start() {
		if (this.Attributes.IsStunned() || !this.States.IsGrounded()) return;
		this.FireSignal();
	}
}

export { ElectricKick, ElectricKickInfo };
