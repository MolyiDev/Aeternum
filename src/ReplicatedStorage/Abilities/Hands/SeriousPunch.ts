// Imports
import { AbilityInfo } from "ReplicatedStorage/Attributes/AbilityInfo";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { CAbility } from "ReplicatedStorage/Classes/Abstracts/CAbility";

const Ability = EAbility.SeriousPunch;
const Cooldown = 5;

const SeriousPunchInfo = {
	[EAnimations.SeriousPunch]: {
		CanFeint: true,
		HasFeintStop: true,
		Sound: true,
		Cooldown: Cooldown,
		AbilityClass: Ability,
	},
};

@AbilityInfo(Ability, {
	Weapon: EWeapon.Hands,
	Cooldown: Cooldown,
	Damage: [40, 35, 30, 20],
	Blockeable: true,
	Dasheable: true,
})
class SeriousPunch extends CAbility {
	public Start() {
		if (this.Attributes.IsStunned() || !this.States.IsGrounded()) return;
		this.FireSignal();
	}
}

export { SeriousPunch, SeriousPunchInfo };
