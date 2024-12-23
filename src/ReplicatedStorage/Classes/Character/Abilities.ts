import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import Signal from "@rbxts/lemon-signal";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

interface PlaceWeapon {
	Place: number;
	Weapon: EWeapon;
}

export class Abilities {
	public AbilitiesFolder: Folder;

	private AbilitiesPerPlace: Map<number | string, Map<EWeapon | string, EAbility | string>>;
	private PlacesPerAbility: Map<EAbility | string, PlaceWeapon>; // Reverse to clean AbilitiesPerPlace on undefined
	public AbilitiesFeint: Set<EAbility | string>;
	private Abilities: Set<EAbility | string>;

	public AbilityAdded: Signal<[number, EWeapon, EAbility]>;
	public AbilityRemoved: Signal<[number, EWeapon, EAbility]>;

	constructor(character: Character) {
		const Model = character.Model;
		const Butler = character.Butler;

		this.AbilitiesFolder = Model.WaitForChild("Abilities") as Folder;

		Butler.Connect(this.AbilitiesFolder.AttributeChanged, (attribute) => this.AbilitiesChanged(attribute));

		this.AbilitiesPerPlace = new Map();
		this.PlacesPerAbility = new Map();
		this.AbilitiesFeint = new Set();
		this.Abilities = new Set();

		this.AbilityAdded = new Signal();
		this.AbilityRemoved = new Signal();

		this.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => this.AbilitiesChanged(ability));
	}

	public Has = (ability: string) => this.Abilities.has(ability);

	public AbilitiesChanged(abilityName: string) {
		const abilityPlace = this.AbilitiesFolder.GetAttribute(abilityName) as string;
		if (!abilityPlace) {
			this.Abilities.delete(abilityName);
			const PlacesPerAbility = this.PlacesPerAbility.get(abilityName);
			if (!PlacesPerAbility) return;

			const AbilityPlace = this.AbilitiesPerPlace.get(PlacesPerAbility.Place);
			if (AbilityPlace) {
				AbilityPlace.delete(PlacesPerAbility.Weapon);
				this.AbilityRemoved.Fire(PlacesPerAbility.Place, PlacesPerAbility.Weapon, abilityName as EAbility);
				this.AbilitiesPerPlace.delete(PlacesPerAbility.Place);
			}

			this.PlacesPerAbility.delete(abilityName);
			return;
		}

		ModuleManager.LoadAbility(abilityName);
		const AbilityInfo = ModuleManager.GetAbilityInfo(abilityName)!;

		let AbilityPlace = this.AbilitiesPerPlace.get(abilityPlace);

		if (!AbilityPlace) {
			this.AbilitiesPerPlace.set(abilityPlace, new Map());
			AbilityPlace = this.AbilitiesPerPlace.get(abilityPlace)!;
		}

		if (!this.Abilities.has(abilityName)) this.Abilities.add(abilityName);

		AbilityPlace.delete(AbilityInfo.Weapon);
		AbilityPlace.set(AbilityInfo.Weapon, abilityName);

		const numberAtt = tonumber(abilityPlace) ?? (abilityPlace as unknown as number);

		this.PlacesPerAbility.delete(abilityName);
		this.PlacesPerAbility.set(abilityName, { Weapon: AbilityInfo.Weapon, Place: numberAtt });

		this.AbilityAdded.Fire(numberAtt, AbilityInfo.Weapon, abilityName as EAbility);
	}

	public Destroy() {
		this.AbilitiesPerPlace.clear();
		this.PlacesPerAbility.clear();
		this.Abilities.clear();
		this.AbilityAdded.Destroy();
		this.AbilityRemoved.Destroy();

		this.AbilitiesFolder = undefined!;
		this.AbilitiesPerPlace = undefined!;
		this.PlacesPerAbility = undefined!;
		this.AbilitiesFeint = undefined!;
		this.Abilities = undefined!;
		this.AbilityAdded = undefined!;
		this.AbilityRemoved = undefined!;
	}
}
