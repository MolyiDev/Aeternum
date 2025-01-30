import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { Character } from ".";
import Signal from "@rbxts/lemon-signal";
import { Players, RunService } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { CStyle } from "../Abstracts/CStyle";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";

export class Styles {
	private Character: Character;

	private MovesFolder: Folder;

	public Style: string = EStyle.None;

	public ModuleStyles: Map<string, CStyle>;
	public StylesFeint: Set<string>;
	public StylesChanged: Signal<[string, string]>;

	constructor(character: Character) {
		this.Character = character;
		this.MovesFolder = character.Model.WaitForChild("Styles") as Folder;

		this.ModuleStyles = new Map();
		this.StylesFeint = new Set();
		this.StylesChanged = new Signal();

		character.Butler.Connect(this.MovesFolder.AttributeChanged, (attribute) => this.StyleChanged());
		this.StyleChanged();
	}

	public Get = (styleType: EStyleType | string) =>
		this.ModuleStyles.get(`${this.Style}_${this.Character.Weapons.EquippedWeapon}_${styleType}`)!;

	public Start = (styleType: EStyleType | string, ...args: Array<unknown>) => {
		const StyleName = `${this.Style}_${this.Character.Weapons.EquippedWeapon}_${styleType}`;

		if (tick() - this.Character.Attributes.TickAnim(styleType) < ModuleManager.GetStyleInfo(StyleName)!.Cooldown)
			return;

		this.ModuleStyles.get(
			`${this.Character.Styles.Style}_${this.Character.Weapons.EquippedWeapon}_${styleType}`,
		)!.Start(...args);
	};

	public StartConstant = (style: EStyleType | string, ...args: Array<unknown>) => {
		const StyleName = `${this.Style}_${this.Character.Weapons.EquippedWeapon}_${style}`;

		if (tick() - this.Character.Attributes.TickAnim(style) < ModuleManager.GetStyleInfo(StyleName)!.Cooldown)
			return;

		this.ModuleStyles.get(`${this.Character.Styles.Style}_${this.Character.Weapons.EquippedWeapon}_${style}`)!
			.StartConstant!(...args);
	};

	public Stop = (style: EStyleType | string, ...args: Array<unknown>) => this.Get(style).Stop!(...args);

	public StyleChanged() {
		const style = this.MovesFolder.GetAttribute("Style") as string;
		if (!style) return;

		this.Style = style;

		if (
			(RunService.IsClient() && (!this.Character.Player || this.Character.Player !== Players.LocalPlayer)) ||
			(RunService.IsServer() && this.Character.Player)
		) {
			this.StylesChanged.Fire(this.Style, style);
			return;
		}

		this.ModuleStyles.clear();

		for (const weapon of Object.values(EWeapon)) {
			for (const styleType of Object.values(EStyleType)) {
				const Name = `${style}_${weapon}_${styleType}`;
				const StyleClass = ModuleManager.GetStyle(Name);
				if (!StyleClass) continue;
				const NewStyleClass = new StyleClass(this.Character);
				this.ModuleStyles.set(Name, NewStyleClass);
			}
		}

		this.StylesChanged.Fire(this.Style, style);
	}

	public Destroy() {
		this.StylesChanged.Destroy();
		this.ModuleStyles.clear();
		this.StylesFeint.clear();

		this.Character = undefined!;
		this.MovesFolder = undefined!;
		this.Style = undefined!;
		this.StylesChanged = undefined!;
		this.ModuleStyles = undefined!;
		this.StylesFeint = undefined!;
	}
}
