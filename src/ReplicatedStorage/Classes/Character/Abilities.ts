import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from ".";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import Signal from "@rbxts/lemon-signal";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

interface PlaceWeapon {
	Place: number;
	Weapon: EWeapons;
}

export class Abilities {
	private AbilitiesFolder: Folder;

	private AbilitiesPerPlace: Map<number | string, Map<EWeapons | string, EAbility | string>>;
	private PlacesPerAbility: Map<EAbility | string, PlaceWeapon>; // Reverse to clean AbilitiesPerPlace on undefined
	public AbilitiesFeint: Map<EAbility | string, boolean>;
	private Abilities: Set<EAbility | string>;

	public AbilityAdded: Signal<[number, EWeapons, EAbility]>;
	public AbilityRemoved: Signal<[number, EWeapons, EAbility]>;

	constructor(character: Character) {
		const Model = character.Model;
		const Butler = character.Butler;

		this.AbilitiesFolder = Model.Abilities;

		Butler.Connect(this.AbilitiesFolder.AttributeChanged, (attribute) => this.AbilitiesChanged(attribute));

		this.AbilitiesPerPlace = new Map();
		this.PlacesPerAbility = new Map();
		this.AbilitiesFeint = new Map();
		this.Abilities = new Set();

		this.AbilityAdded = new Signal();
		this.AbilityRemoved = new Signal();

		this.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => this.AbilitiesChanged(ability));
	}

	public Has = (ability: string) => this.Abilities.has(ability);

	public AbilitiesChanged(attribute: string) {
		// Attribute is the name of the ability (EAbility) and getAtt is the place of the ability (EAbilityPlace)
		const getAtt = this.AbilitiesFolder.GetAttribute(attribute) as string;
		if (!getAtt) {
			this.Abilities.delete(attribute);
			const PlacesPerAbility = this.PlacesPerAbility.get(attribute);
			if (!PlacesPerAbility) return;

			const AbilityPlace = this.AbilitiesPerPlace.get(PlacesPerAbility.Place);
			if (AbilityPlace) {
				AbilityPlace.delete(PlacesPerAbility.Weapon);
				this.AbilityRemoved.Fire(PlacesPerAbility.Place, PlacesPerAbility.Weapon, attribute as EAbility);
				this.AbilitiesPerPlace.delete(PlacesPerAbility.Place);
			}

			this.PlacesPerAbility.delete(attribute);

			return;
		}

		ModuleManager.LoadModule(attribute);
		const AbilityInfo = ModuleManager.GetAbilityInfo(attribute)!;

		let AbilityPlace = this.AbilitiesPerPlace.get(getAtt);

		if (!AbilityPlace) {
			this.AbilitiesPerPlace.set(getAtt, new Map());
			AbilityPlace = this.AbilitiesPerPlace.get(getAtt)!;
		}

		if (!this.Abilities.has(attribute)) this.Abilities.add(attribute);

		AbilityPlace.delete(AbilityInfo.Weapon);
		AbilityPlace.set(AbilityInfo.Weapon, attribute);

		const numberAtt = tonumber(getAtt) ?? (getAtt as unknown as number);

		this.PlacesPerAbility.delete(attribute);
		this.PlacesPerAbility.set(attribute, { Weapon: AbilityInfo.Weapon, Place: numberAtt });

		this.AbilityAdded.Fire(numberAtt, AbilityInfo.Weapon, attribute as EAbility);
	}

	public Destroy() {
		this.AbilitiesPerPlace.clear();
		this.PlacesPerAbility.clear();
		this.Abilities.clear();
		this.AbilityAdded.Destroy();
		this.AbilityRemoved.Destroy();
	}
}
