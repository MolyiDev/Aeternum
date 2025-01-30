/* eslint-disable no-constant-condition */
// Imports
import { HttpService, Players, RunService } from "@rbxts/services";
import { NPCManager } from "ReplicatedStorage/Managers/NPCManager";
import Signal from "@rbxts/lemon-signal";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { Butler } from "ReplicatedStorage/Modules/Butler";

// Variables
const ButlerPerPlayer = new Map<Player, Butler>();
const CharacterPerModel = new Map<Model, Character>();
const CharacterPerId = new Map<string, Character>();

const AddedCharacterSignal = new Signal<[character: Character]>();
const RemovedCharacterSignal = new Signal<[character: Character]>();

export class CharacterManager {
	public static AddedCharacter = AddedCharacterSignal;
	public static RemovedCharacter = RemovedCharacterSignal;

	public static GetCharacterByModel(model: Model | Instance | undefined) {
		if (!model || !model.IsA("Model")) return undefined;
		return CharacterPerModel.get(model);
	}

	public static GetCharacterById(characterId: string) {
		const character = CharacterPerId.get(characterId);
		return character;
	}

	public static WaitCharacter(model: Model) {
		const existingPlayer = CharacterPerModel.get(model);
		if (existingPlayer) return existingPlayer;

		while (true) {
			const character = AddedCharacterSignal.Wait()[0];
			if (character.Model === model) return character;
		}
	}
}

function RegisterCharacter(model: Model) {
	if (CharacterPerModel.has(model)) return;
	const characterId = HttpService.GenerateGUID(false);
	const character = new Character(model as IModel, characterId);
	CharacterPerModel.set(model, character);
	CharacterPerId.set(characterId, character);

	AddedCharacterSignal.Fire(character);
}

function UnRegisterCharacter(model: Model) {
	const character = CharacterPerModel.get(model);
	if (!character || character.IsDestroyed) return;

	RemovedCharacterSignal.Fire(character);
	character.Destroy();
	CharacterPerModel.delete(model);
}

function RegisterPlayer(player: Player) {
	const butler = new Butler();
	ButlerPerPlayer.set(player, butler);

	RegisterCharacter(player.Character ?? player.CharacterAdded.Wait()[0]);

	butler.Connect(player.CharacterAdded, (model) => RegisterCharacter(model));
	butler.Connect(player.CharacterRemoving, (model) => UnRegisterCharacter(model));
}

function UnRegisterPlayer(player: Player) {
	const character = player.Character;
	if (character) UnRegisterCharacter(character);

	const butler = ButlerPerPlayer.get(player);
	if (!butler) return;
	butler.Destroy();
	ButlerPerPlayer.delete(player);
}

Players.PlayerAdded.Connect((player) => RegisterPlayer(player));
Players.PlayerRemoving.Connect((player) => UnRegisterPlayer(player));

if (RunService.IsClient()) {
	NPCManager.NPCAddedClient.OnClientEvent.Connect((character) => RegisterCharacter(character));
	NPCManager.NPCRemovedClient.OnClientEvent.Connect((character) => UnRegisterCharacter(character));

	for (const player of Players.GetPlayers()) RegisterPlayer(player);
	for (const npc of NPCManager.GetNPCs()) RegisterCharacter(npc);
} else {
	NPCManager.NPCAddedServer.Connect((model) => RegisterCharacter(model));
	NPCManager.NPCRemovedServer.Connect((model) => UnRegisterCharacter(model));
}
