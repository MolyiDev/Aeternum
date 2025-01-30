// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Block}`;

const Default_Hands_BlockInfo = {
	[EAnimations.Default_Hands_BlockUpper]: {
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_BlockBottom]: {
		StyleClass: Style,
	},
	[Style]: {
		StyleClass: Style,
	},
};

@StyleInfo(Style, {
	Damage: [20],
	PerfectBlockeable: true,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_Block extends CStyle {
	public Start() {
		if (this.Attributes.IsStunned() || this.Attributes.IsBlocking()) return;
		this.FireSignal(true);
	}

	public StartConstant(): void {
		if (this.Attributes.IsStunned() || this.Attributes.IsBlocking()) return;
		this.FireSignal(true);
	}

	public Stop() {
		if (!this.Attributes.IsBlocking()) return;
		this.FireSignal(false);
	}
}

export { Default_Hands_Block, Default_Hands_BlockInfo };
