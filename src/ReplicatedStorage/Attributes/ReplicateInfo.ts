/* eslint-disable @typescript-eslint/no-explicit-any */
import Object from "@rbxts/object-utils";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultReplicateInfo: IReplicateInfo = {
	SelfInit: false,
	Signal: false,
	CanFeint: false,
	HasFeintStop: false,
	ReplicateStunned: false,
	CanOverride: false,
	Sound: false,
	Cooldown: 0,
	ReplicateClass: undefined,
	AbilityClass: undefined,
	StyleClass: undefined,
};

export function ReplicateInfo(...infoMaps: { [anim: string]: Partial<IReplicateInfo> }[]) {
	return function (target: unknown) {
		const mergedInfoMap: { [anim: string]: Partial<IReplicateInfo> } = {};
		for (const infoMap of infoMaps) Object.assign(mergedInfoMap, infoMap);

		for (const [animation, info] of Object.entries(mergedInfoMap)) {
			if (!info.ReplicateClass) info.ReplicateClass = tostring(target);
			ModuleManager.SetReplicateInfo(animation as string, { ...defaultReplicateInfo, ...info });
		}
	};
}
