/* eslint-disable @typescript-eslint/no-explicit-any */
import Object from "@rbxts/object-utils";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

const defaultReplicateInfo: IReplicateInfo = {
	Ability: false,
	Move: false,
	Signal: false,
	CanFeint: false,
	HasFeintStop: true,
	CanUseStunned: false,
	Sound: false,
	Cooldown: 0,
	Class: undefined,
};

export function ReplicateInfo(infoMap: { [anim: string]: Partial<IReplicateInfo> }) {
	return function (target: unknown) {
		for (const [animation, info] of Object.entries(infoMap))
			ModuleManager.SetReplicateInfo(animation as string, { ...defaultReplicateInfo, ...info });
	};
}
