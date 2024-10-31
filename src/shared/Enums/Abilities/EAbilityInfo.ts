import { IAbilityInfo } from "shared/Interfaces/IAbilityInfo";
import { EAbility } from "./EAbility";
import { EWeapons } from "../EWeapons";

export const EAbilityInfo: { [key in string]: IAbilityInfo } = {
	[EAbility.SeriousPunch]: {
		Weapon: EWeapons.Hands,
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
		Weapon: EWeapons.Hands,
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
		Weapon: EWeapons.Hands,
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
