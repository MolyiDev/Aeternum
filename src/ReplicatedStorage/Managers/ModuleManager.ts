/* eslint-disable @typescript-eslint/no-require-imports */
import { ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { CAbility } from "ReplicatedStorage/Classes/Abstracts/CAbility";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { IStyleInfo } from "ReplicatedStorage/Interfaces/IStyleInfo";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";

const Abilities = ReplicatedStorage.WaitForChild("Abilities").GetDescendants();
const Styles = ReplicatedStorage.WaitForChild("Styles").GetDescendants();

const ReplicatesDictionary: { [key: string]: ModuleScript } = {};
const AbilitiesDictionary: { [key: string]: ModuleScript } = {};
const StylesDictionary: { [key: string]: ModuleScript } = {};
const ReplicatesInfo = new Map<string, IReplicateInfo>();
const AbilitiesInfo = new Map<string, IAbilityInfo>();
const StylesInfo = new Map<string, IStyleInfo>();

if (RunService.IsClient()) {
	const ReplicatesClient = ReplicatedStorage.WaitForChild("Classes").WaitForChild("Replicate").GetDescendants();

	ReplicatesClient.forEach((replicate) => {
		if (!replicate.IsA("ModuleScript")) return;
		ReplicatesDictionary[replicate.Name] = replicate;
	});
} else {
	const ReplicatesServer = ServerScriptService.WaitForChild("Replicate").GetDescendants();

	ReplicatesServer.forEach((replicate) => {
		if (!replicate.IsA("ModuleScript")) return;
		ReplicatesDictionary[replicate.Name] = replicate;
	});
}

Abilities.forEach((ability) => {
	if (!ability.IsA("ModuleScript")) return;
	AbilitiesDictionary[ability.Name] = ability;
});

Styles.forEach((style) => {
	if (!style.IsA("ModuleScript")) return;
	StylesDictionary[style.Name] = style;
});

export class ModuleManager {
	public static GetReplicate(name: string) {
		const ReplicateModule = ReplicatesDictionary[name];
		if (!ReplicateModule) return undefined!;

		return (require(ReplicateModule) as { [key: string]: new (character: Character) => CReplicate })[name];
	}

	public static SetReplicateInfo = (name: string, info: IReplicateInfo) => ReplicatesInfo.set(name, info);
	public static GetReplicateInfo = (name: string) => ReplicatesInfo.get(name);

	public static LoadAbility = (name: string) => require(AbilitiesDictionary[name]);
	public static LoadReplicate(name: string) {
		const ReplicateModule = ReplicatesDictionary[name];
		if (!ReplicateModule) return undefined!;

		require(ReplicateModule);
	}

	public static GetAbility(name: string) {
		const AbilityModule = AbilitiesDictionary[name];
		return (require(AbilityModule) as { [key: string]: new (character: Character) => CAbility })[name];
	}

	public static GetStyle(name: string) {
		const StyleModule = StylesDictionary[name];
		if (!StyleModule) return undefined!;
		return (require(StyleModule) as { [key: string]: new (character: Character) => CStyle })[name];
	}

	public static SetAbilityInfo = (name: string, info: IAbilityInfo) => AbilitiesInfo.set(name, info);
	public static SetStyleInfo = (name: string, info: IStyleInfo) => StylesInfo.set(name, info);

	public static GetAbilityInfo = (name: string) => AbilitiesInfo.get(name);
	public static GetStyleInfo = (name: string) => StylesInfo.get(name);

	public static IsAbility = (name: string) => AbilitiesDictionary[name] !== undefined;
	public static IsStyle = (name: string) => StylesDictionary[name] !== undefined;
}
