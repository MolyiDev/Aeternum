import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { Character } from ".";
import Signal from "@rbxts/lemon-signal";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";

export class Moves {
	private Character: Character;

	private MovesFolder: Folder;

	public MoveSet: string = undefined!;

	public ModuleMoves: Map<string, IMove>;
	public MovesFeint: Set<string>;
	public MoveSetChanged: Signal<[string, string]>;

	constructor(character: Character) {
		this.Character = character;
		this.MovesFolder = character.Model.WaitForChild("Moves") as Folder;

		character.Butler.Connect(this.MovesFolder.AttributeChanged, (attribute) => this.MovesChanged(attribute));

		this.ModuleMoves = new Map();
		this.MovesFeint = new Set();
		this.MoveSetChanged = new Signal();

		this.MovesChanged("MoveSet");
	}

	public Get = (move: EMove | string) =>
		this.ModuleMoves.get(`${this.Character.Moves.MoveSet}_${this.Character.Weapons.EquippedWeapon}_${move}`)!;

	public MovesChanged(moveName: string) {
		const moveSet = this.MovesFolder.GetAttribute(moveName) as string;
		if (!moveSet) return;

		this.MoveSetChanged.Fire(this.MoveSet, moveSet);
		this.MoveSet = moveSet;

		if (!this.Character.Player || this.Character.Player !== Players.LocalPlayer) return;

		this.ModuleMoves.clear();

		for (const weapon of Object.values(EWeapon)) {
			for (const move of Object.values(EMove)) {
				const Name = `${moveSet}_${weapon}_${move}`;
				const MoveClass = ModuleManager.GetMove(Name);
				if (!MoveClass) continue;
				const NewMoveClass = new MoveClass(this.Character);
				this.ModuleMoves.set(Name, NewMoveClass);
			}
		}
	}

	public Destroy() {
		this.MoveSetChanged.Destroy();
		this.ModuleMoves.clear();
		this.MovesFeint.clear();

		this.Character = undefined!;
		this.MovesFolder = undefined!;
		this.MoveSet = undefined!;
		this.MoveSetChanged = undefined!;
		this.ModuleMoves = undefined!;
		this.MovesFeint = undefined!;
	}
}
