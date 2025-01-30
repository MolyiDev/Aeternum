// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Dodge}`;

const Default_Hands_DodgeInfo = {
	[EAnimations.Default_Hands_Dodge1]: {
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_Dodge2]: {
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_Dodge3]: {
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_Dodge4]: {
		StyleClass: Style,
	},
	[Style]: {
		StyleClass: Style,
	},
};

@StyleInfo(Style, {
	Cooldown: 5,
})
class Default_Hands_Dodge extends CStyle {
	public Start() {
		if (this.Attributes.IsStunned() || !this.Attributes.IsBlocking()) return;
		this.FireSignal(true);
	}
}

export { Default_Hands_Dodge, Default_Hands_DodgeInfo };
