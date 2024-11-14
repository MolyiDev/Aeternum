/* eslint-disable @typescript-eslint/no-require-imports */
import { ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EReplicateInfo } from "ReplicatedStorage/Enums/Replicate/EReplicateInfo";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";

const Abilities = ReplicatedStorage.WaitForChild("Abilities")
	.GetDescendants()
	.filter((descendant) => descendant.IsA("ModuleScript"));

const ReplicatesDictionary: { [key: string]: ModuleScript } = {};
const ReplicatesInfo: { [key: string]: IReplicateInfo } = {};
const AbilitiesDictionary: { [key: string]: ModuleScript } = {};

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

	public static GetReplicateInfo = (name: string) => EReplicateInfo.get(name);

	public static GetAbility(name: string) {
		const AbilityModule = AbilitiesDictionary[name];
		return (require(AbilityModule) as { [key: string]: new (character: Character) => IAbility })[name];
	}
}
