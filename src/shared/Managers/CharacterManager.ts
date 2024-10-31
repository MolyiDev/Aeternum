/* eslint-disable no-constant-condition */
// Imports
import { Players, RunService } from "@rbxts/services";
import { NPCManager } from "shared/Managers/NPCManager";
import Signal from "@rbxts/lemon-signal";
import { Character } from "shared/Classes/Character";
import { IModel } from "shared/Interfaces/IModel";
import { Butler } from "shared/Modules/Butler";

// Variables
const ButlerPerPlayer = new Map<Player, Butler>();
const CharacterPerModel = new Map<Model, Character>();

const AddedCharacterSignal = new Signal<[character: Character]>();
const RemovedCharacterSignal = new Signal<[character: Character]>();

export class CharacterManager {
	public static AddedCharacter = AddedCharacterSignal;
	public static RemovedCharacter = RemovedCharacterSignal;

	public static GetCharacter(model: Model | Instance | undefined) {
		if (!model || !model.IsA("Model")) return undefined;
		const existingPlayer = CharacterPerModel.get(model);
		return existingPlayer;
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
	const character = new Character(model as IModel);
	CharacterPerModel.set(model, character);

	AddedCharacterSignal.Fire(character);
}

function UnRegisterCharacter(model: Model) {
	const character = CharacterPerModel.get(model);
	if (!character) return;

	RemovedCharacterSignal.Fire(character);
	character.Destroy();
	CharacterPerModel.delete(model);
}

function RegisterPlayer(player: Player) {
	const butler = new Butler();
	ButlerPerPlayer.set(player, butler);

	const charLoaded = player.Character;
	if (charLoaded) RegisterCharacter(charLoaded);
	else RegisterCharacter(player.CharacterAdded.Wait()[0]);

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
