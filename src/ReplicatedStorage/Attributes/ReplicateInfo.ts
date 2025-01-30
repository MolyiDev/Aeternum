/* eslint-disable @typescript-eslint/no-explicit-any */
import Object from "@rbxts/object-utils";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultReplicateInfo: IReplicateInfo = {
	Receive: false,
	Signal: false,
	CanFeint: false,
	HasFeintStop: false,
	ReplicateStunned: false,
	CanOverride: false, // If the animation can be on top or on bottom of another one (when using ability or style)
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
