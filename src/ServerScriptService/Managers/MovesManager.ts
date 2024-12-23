// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const MoveUse = Events.WaitForChild("MoveUse") as RemoteEvent;

MoveUse.OnServerEvent.Connect((player, ...args: Array<unknown>) => {
	if (args.size() < 2) return;
	const MoveSet = args[0] as EMoveSet;
	if (!MoveSet || MoveSet !== MoveSet || !typeIs(MoveSet, "string")) return;
	const Move = args[1] as EMove;
	if (!Move || Move !== Move || !typeIs(Move, "string")) return;
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const Humanoid = Character.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0) return;
	const Moves = Character.Moves;
	if (Moves.MoveSet !== MoveSet) return;
	Character.ReplicateServer.SignalFired(`${MoveSet}_${Character.Weapons.EquippedWeapon}_${Move}`);
});

export class MovesManager {
	public static ChangeMoveSet = (character: Character, moveSet: EMoveSet) =>
		character.Model.Moves.SetAttribute("MoveSet", moveSet);
}
