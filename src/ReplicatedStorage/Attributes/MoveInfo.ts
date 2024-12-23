/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMoveInfo } from "ReplicatedStorage/Interfaces/IMoveInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultAbilityInfo: IMoveInfo = {
	Cooldown: 0,
	Damage: [],
	ParryStunTime: 0,
	ParryTime: 0, // Time that can parry
	Parryable: false,
	BlockDamageReduce: 0, // Damage = Damage[0] / BlockDamageReduce
	Blockeable: false,
	Dasheable: false,
};

export function MoveInfo(name: string, info: Partial<IMoveInfo>) {
	return function (target: unknown) {
		ModuleManager.SetMoveInfo(name, { ...defaultAbilityInfo, ...info });
	};
}
