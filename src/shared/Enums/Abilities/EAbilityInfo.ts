import { IAbilityInfo } from "shared/Interfaces/IAbilityInfo";
import { EAbility } from "./EAbility";

export const EAbilityInfo: { [key in string]: IAbilityInfo } = {
	[EAbility.SeriousPunch]: {
		Cooldown: 5,
		Damage: [40, 35, 30, 20],
		ParryStunTime: 0.25,
		ParryTime: 0.2,
		Parryable: true,
		BlockDamageReduce: 4,
		Blockeable: true,
		Dasheable: true,
	},

	[EAbility.ElectricKick]: {
		Cooldown: 5,
		Damage: [10, 10, 20],
		ParryStunTime: 0.85,
		ParryTime: 0.2,
		Parryable: true,
		BlockDamageReduce: 0,
		Blockeable: true,
		Dasheable: true,
	},

	[EAbility.GroundSmash]: {
		Cooldown: 5,
		Damage: [50, 30, 10],
		ParryStunTime: 0.85,
		ParryTime: 0.2,
		Parryable: true,
		BlockDamageReduce: 4,
		Blockeable: true,
		Dasheable: true,
	},
};
