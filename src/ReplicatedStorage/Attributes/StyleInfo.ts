/* eslint-disable @typescript-eslint/no-explicit-any */
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { IStyleInfo } from "ReplicatedStorage/Interfaces/IStyleInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultStyleInfo: IStyleInfo = {
	Cooldown: 0,
	Damage: [],
	Blockeable: false,
	PerfectBlockeable: false,
	Dasheable: false,
	Dodgeable: false,
	ReplicateClass: undefined,
};

export function StyleInfo(name: string, info: Partial<IStyleInfo>) {
	return function (target: unknown) {
		ModuleManager.SetStyleInfo(name, { ...defaultStyleInfo, ...info });
		(target as CStyle).Style = name.split("_")[2];
	};
}
