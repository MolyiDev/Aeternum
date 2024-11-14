import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAbilityPlace } from "ReplicatedStorage/Enums/Abilities/EAbilityPlace";
import { Character } from ".";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { EAbilityInfo } from "ReplicatedStorage/Enums/Abilities/EAbilityInfo";
import Signal from "@rbxts/lemon-signal";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

interface PlaceWeapon {
	Place: EAbilityPlace;
	Weapon: EWeapons;
}

export class Abilities {
	private AbilitiesFolder: Folder;

	private AbilitiesPerPlace: Map<EAbilityPlace | string, Map<EWeapons | string, EAbility | string>>;
	private PlacesPerAbility: Map<EAbility | string, PlaceWeapon>; // Reverse to clean AbilitiesPerPlace on undefined
	public AbilitiesFeint: Map<EAbility | string, boolean>;
	private Abilities: Set<EAbility | string>;

	public AbilityAdded: Signal<[EAbilityPlace, EWeapons, EAbility]>;
	public AbilityRemoved: Signal<[EAbilityPlace, EWeapons, EAbility]>;

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

	public CanFeint(ability: string): boolean {
		const ReplicateInfo = ModuleManager.GetReplicateInfo(ability);
		print(ability, ReplicateInfo);
		if (!ReplicateInfo || !ReplicateInfo.CanFeint || !this.AbilitiesFeint.get(ability)) return false;
		return true;
	}

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

		const AbilityInfo = EAbilityInfo[attribute];

		let AbilityPlace = this.AbilitiesPerPlace.get(getAtt);

		if (!AbilityPlace) {
			this.AbilitiesPerPlace.set(getAtt, new Map());
			AbilityPlace = this.AbilitiesPerPlace.get(getAtt)!;
		}

		if (!this.Abilities.has(attribute)) this.Abilities.add(attribute);

		AbilityPlace.delete(AbilityInfo.Weapon);
		AbilityPlace.set(AbilityInfo.Weapon, attribute);

		this.PlacesPerAbility.delete(attribute);
		this.PlacesPerAbility.set(attribute, { Weapon: AbilityInfo.Weapon, Place: getAtt as EAbilityPlace });

		this.AbilityAdded.Fire(getAtt as EAbilityPlace, AbilityInfo.Weapon, attribute as EAbility);
	}

	public Destroy() {
		this.AbilitiesPerPlace.clear();
		this.PlacesPerAbility.clear();
		this.Abilities.clear();
		this.AbilityAdded.Destroy();
		this.AbilityRemoved.Destroy();
	}
}
