/* eslint-disable @typescript-eslint/no-explicit-any */
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultAbilityInfo: IAbilityInfo = {
	Weapon: EWeapon.Hands,
	Cooldown: 0,
	Damage: [],
	ParryStunTime: 0,
	ParryTime: 0, // Time that can parry
	Parryable: false,
	BlockDamageReduce: 0, // Damage = Damage[0] / BlockDamageReduce
	Blockeable: false,
	Dasheable: false,
};

export function AbilityInfo(name: string, info: Partial<IAbilityInfo>) {
	return function (target: unknown) {
		ModuleManager.SetAbilityInfo(name, { ...defaultAbilityInfo, ...info });
	};
}
