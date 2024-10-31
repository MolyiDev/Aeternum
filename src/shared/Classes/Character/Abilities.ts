import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { Character } from ".";
import { EWeapons } from "shared/Enums/EWeapons";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";

interface PlaceWeapon {
	Place: EAbilityPlace | string;
	Weapon: EWeapons;
}

export class Abilities {
	private AbilitiesFolder: Folder;
	private AbilitiesPerPlace: Map<EAbilityPlace | string, Map<EWeapons | string, EAbility | string>>;
	private PlacesPerAbility: Map<EAbility | string, PlaceWeapon>; // Reverse to clean AbilitiesPerPlace on undefined
	private Abilities: Set<EAbility | string>;

	constructor(character: Character) {
		const Model = character.Model;
		const Butler = character.Butler;

		this.AbilitiesFolder = Model.Abilities;

		Butler.Connect(this.AbilitiesFolder.AttributeChanged, (attribute) => this.AbilitiesChanged(attribute));
		this.AbilitiesPerPlace = new Map();
		this.PlacesPerAbility = new Map();
		this.Abilities = new Set();
	}

	public Has = (ability: string) => this.Abilities.has(ability);
	public GetAbilityInPlace = (ability: EAbilityPlace) => this.AbilitiesPerPlace.get(ability);

	public IsOnCooldown(ability: EAbility) {}

	public IsUsing(ability: EAbility) {}

	public CanFeint(ability: EAbility) {}

	public AbilitiesChanged(attribute: string) {
		// Attribute is the name of the ability (EAbility) and getAtt is the place of the ability (EAbilityPlace)

		const getAtt = this.AbilitiesFolder.GetAttribute(attribute) as string;
		if (!getAtt) {
			this.Abilities.delete(attribute);
			const PlacesPerAbility = this.PlacesPerAbility.get(attribute);
			if (PlacesPerAbility) {
				const AbilityPlace = this.AbilitiesPerPlace.get(PlacesPerAbility.Place);
				if (AbilityPlace) {
					AbilityPlace.delete(PlacesPerAbility.Weapon);
					this.AbilitiesPerPlace.delete(PlacesPerAbility.Place);
				}

				this.PlacesPerAbility.delete(attribute);
			}

			return;
		}

		const AbilityInfo = EAbilityInfo[attribute];

		let AbilityPlace = this.AbilitiesPerPlace.get(getAtt);

		if (!AbilityPlace) {
			this.AbilitiesPerPlace.set(getAtt, new Map());
			AbilityPlace = this.AbilitiesPerPlace.get(getAtt)!;
		}

		AbilityPlace.delete(AbilityInfo.Weapon);
		AbilityPlace.set(AbilityInfo.Weapon, attribute);

		this.PlacesPerAbility.delete(attribute);
		this.PlacesPerAbility.set(attribute, { Weapon: AbilityInfo.Weapon, Place: getAtt });
	}
}
