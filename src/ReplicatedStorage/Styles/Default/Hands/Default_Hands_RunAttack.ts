// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.RunAttack}`;

const Default_Hands_RunAttackInfo = {
	[EAnimations.Default_Hands_RunAttack]: {
		Sound: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {
	Damage: [20],
	PerfectBlockeable: true,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_RunAttack extends CStyle {
	public Start() {
		if (
			this.Attributes.IsStunned() ||
			this.Humanoid.WalkSpeed < EMovementSpeeds.Run ||
			!this.States.IsGrounded() ||
			this.Attributes.UsingStyle() ||
			this.IsOnCooldown()
		)
			return;
		if (!this.FireFunction()) return;
	}
}

export { Default_Hands_RunAttack, Default_Hands_RunAttackInfo };
