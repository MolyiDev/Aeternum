// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.BasicAttack}`;

const Default_Hands_BasicAttackInfo = {
	[EAnimations.Default_Hands_BasicAttack1]: {
		CanFeint: true,
		Sound: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_BasicAttack2]: {
		CanFeint: true,
		Sound: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_BasicAttack3]: {
		CanFeint: true,
		Sound: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_BasicAttack4]: {
		CanFeint: true,
		Sound: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_AttackCombo]: {
		CanFeint: false,
		Sound: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_AirAttack]: {
		CanFeint: false,
		Sound: true,
		StyleClass: Style,
	},
	[Style]: {
		CanFeint: true,
		Sound: true,
		Cooldown: 2,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {
	Damage: [5],
	Cooldown: 2,
	PerfectBlockeable: true,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_BasicAttack extends CStyle {
	public Start() {
		if (
			this.Attributes.IsStunned() ||
			this.Attributes.IsBlocking() ||
			this.Attributes.UsingStyle() ||
			this.IsOnCooldown()
		)
			return;
		this.FireSignal();
	}

	public StartConstant(): void {
		if (
			this.Attributes.IsStunned() ||
			this.Attributes.IsBlocking() ||
			this.Attributes.UsingStyle() ||
			this.IsOnCooldown()
		)
			return;
		this.FireSignalConstant();
	}
}

export { Default_Hands_BasicAttack, Default_Hands_BasicAttackInfo };
