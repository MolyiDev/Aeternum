/* eslint-disable @typescript-eslint/no-require-imports */
import { ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { IMoveInfo } from "ReplicatedStorage/Interfaces/IMoveInfo";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";

const Abilities = ReplicatedStorage.WaitForChild("Abilities").GetDescendants();
const Moves = ReplicatedStorage.WaitForChild("Moves").GetDescendants();

const ReplicatesDictionary: { [key: string]: ModuleScript } = {};
const AbilitiesDictionary: { [key: string]: ModuleScript } = {};
const MovesDictionary: { [key: string]: ModuleScript } = {};
const ReplicatesInfo = new Map<string, IReplicateInfo>();
const AbilitiesInfo = new Map<string, IAbilityInfo>();
const MovesInfo = new Map<string, IMoveInfo>();

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

Moves.forEach((move) => {
	if (!move.IsA("ModuleScript")) return;
	MovesDictionary[move.Name] = move;
});

export class ModuleManager {
	public static GetReplicate(name: string) {
		const ReplicateModule = ReplicatesDictionary[name];
		if (!ReplicateModule) return undefined!;

		return (require(ReplicateModule) as { [key: string]: new (character: Character) => IReplicateClass })[name];
	}

	public static SetReplicate = (name: string, module: ModuleScript) => (ReplicatesDictionary[name] = module);

	public static SetReplicateInfo = (name: string, info: IReplicateInfo) => ReplicatesInfo.set(name, info);
	public static GetReplicateInfo = (name: string) => ReplicatesInfo.get(name);

	public static LoadAbility = (name: string) => require(AbilitiesDictionary[name]);

	public static GetAbility(name: string) {
		const AbilityModule = AbilitiesDictionary[name];
		return (require(AbilityModule) as { [key: string]: new (character: Character) => IAbility })[name];
	}

	public static GetMove(name: string) {
		const MoveModule = MovesDictionary[name];
		if (!MoveModule) return undefined!;
		return (require(MoveModule) as { [key: string]: new (character: Character) => IMove })[name];
	}

	public static SetAbilityInfo = (name: string, info: IAbilityInfo) => AbilitiesInfo.set(name, info);
	public static SetMoveInfo = (move: string, info: IMoveInfo) => MovesInfo.set(move, info);

	public static GetAbilityInfo = (name: string) => AbilitiesInfo.get(name);
	public static GetMoveInfo = (name: string) => MovesInfo.get(name);
}
