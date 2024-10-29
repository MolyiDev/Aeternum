/* eslint-disable no-constant-condition */
// Imports
import { Janitor } from "@rbxts/janitor";
import { Players, RunService } from "@rbxts/services";
import { NPCManager } from "shared/Managers/NPCManager";
import Signal from "@rbxts/lemon-signal";
import { Character } from "shared/Classes/Character";

// Variables
const JanitorPerPlayer = new Map<Player, Janitor>();
const CharacterPerModel = new Map<Model, Character>();

const AddedCharacterSignal = new Signal<[character: Character]>();
const RemovedCharacterSignal = new Signal<[character: Character]>();

export class CharacterManager {
	public static AddedCharacter = AddedCharacterSignal;
	public static RemovedCharacter = RemovedCharacterSignal;

	public static GetCharacter(model: Model) {
		const existingPlayer = CharacterPerModel.get(model);
		if (existingPlayer) return existingPlayer;

		while (true) {
			const character = AddedCharacterSignal.Wait()[0];
			if (character.Model === model) return character;
		}
	}
}

function RegisterCharacter(model: Model) {
	const character = new Character(model);
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
	const janitor = new Janitor();
	JanitorPerPlayer.set(player, janitor);

	const charLoaded = player.Character;
	if (charLoaded) RegisterCharacter(charLoaded);

	janitor.Add(player.CharacterAdded.Connect((model) => RegisterCharacter(model)));
	janitor.Add(player.CharacterRemoving.Connect((model) => UnRegisterCharacter(model)));
}

function UnRegisterPlayer(player: Player) {
	const character = player.Character;
	if (character) UnRegisterCharacter(character);

	const janitor = JanitorPerPlayer.get(player);
	if (!janitor) return;
	janitor.Destroy();
	JanitorPerPlayer.delete(player);
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
