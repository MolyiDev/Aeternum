/* eslint-disable @typescript-eslint/no-require-imports */
import { ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";

const Abilities = ReplicatedStorage.WaitForChild("Abilities")
	.GetDescendants()
	.filter((descendant) => descendant.IsA("ModuleScript"));

const ReplicatesDictionary: { [key: string]: ModuleScript } = {};
const AbilitiesDictionary: { [key: string]: ModuleScript } = {};
const ReplicatesInfo = new Map<string, IReplicateInfo>();
const AbilitiesInfo = new Map<string, IAbilityInfo>();

if (RunService.IsClient()) {
	const Replicates = ReplicatedStorage.WaitForChild("Classes")
		.WaitForChild("Replicate")
		.GetDescendants()
		.filter((descendant) => descendant.IsA("ModuleScript"));

	Replicates.forEach((ReplicateClass) => {
		const className = ReplicateClass.Name;
		ReplicatesDictionary[className] = ReplicateClass;
	});
} else {
	const Replicates = ServerScriptService.WaitForChild("Replicate")
		.GetDescendants()
		.filter((descendant) => descendant.IsA("ModuleScript"));

	Replicates.forEach((ReplicateClass) => {
		const className = ReplicateClass.Name;
		ReplicatesDictionary[className] = ReplicateClass;
	});
}

Abilities.forEach((AbilityClass) => {
	const className = AbilityClass.Name;
	AbilitiesDictionary[className] = AbilityClass;
});

export class ModuleManager {
	public static GetReplicate(name: string) {
		const ReplicateModule = ReplicatesDictionary[name];
		return (require(ReplicateModule) as { [key: string]: new (character: Character) => IReplicateClass })[name];
	}

	public static SetReplicateInfo = (name: string, info: IReplicateInfo) => ReplicatesInfo.set(name, info);

	public static GetReplicateInfo = (name: string) => ReplicatesInfo.get(name);

	public static LoadModule = (name: string) => require(AbilitiesDictionary[name]);

	public static GetAbility(name: string) {
		const AbilityModule = AbilitiesDictionary[name];
		return (require(AbilityModule) as { [key: string]: new (character: Character) => IAbility })[name];
	}

	public static SetAbilityInfo = (name: string, info: IAbilityInfo) => AbilitiesInfo.set(name, info);
	public static GetAbilityInfo = (name: string) => AbilitiesInfo.get(name);
}
