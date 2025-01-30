/* eslint-disable @typescript-eslint/no-explicit-any */
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { CAbility } from "ReplicatedStorage/Classes/Abstracts/CAbility";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultAbilityInfo: IAbilityInfo = {
	Weapon: EWeapon.Hands,
	Cooldown: 0,
	Damage: [],
	Blockeable: false,
	PerfectBlockeable: false,
	Dasheable: false,
	Dodgeable: false,
};

export function AbilityInfo(name: string, info: Partial<IAbilityInfo>) {
	return function (target: unknown) {
		ModuleManager.SetAbilityInfo(name, { ...defaultAbilityInfo, ...info });
		(target as CAbility).Ability = name;
	};
}
