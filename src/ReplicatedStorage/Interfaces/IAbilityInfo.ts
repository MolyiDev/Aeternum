import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";

export interface IAbilityInfo {
	Weapon: EWeapon;
	Cooldown: number;
	Damage: number[];
	Blockeable: boolean;
	PerfectBlockeable: boolean;
	Dasheable: boolean;
	Dodgeable: boolean;
}
