import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";

export class Abilities {
	private AbilitiesPerPlace: Map<EAbilityPlace, EAbility>;
	private Abilities: Set<string>;

	constructor() {
		this.AbilitiesPerPlace = new Map<EAbilityPlace, EAbility>();
		this.Abilities = new Set<EAbility>();
	}

	public Add(abilityPlace: EAbilityPlace, ability: EAbility) {
		this.AbilitiesPerPlace.set(abilityPlace, ability);
		this.Abilities.add(ability);
	}

	public Remove(abilityPlace: EAbilityPlace) {
		const ability = this.AbilitiesPerPlace.get(abilityPlace);
		if (!ability) return;
		this.Abilities.delete(ability);
		this.AbilitiesPerPlace.delete(abilityPlace);
	}

	public Has = (ability: string) => this.Abilities.has(ability);
	public GetAbilityInPlace = (ability: EAbilityPlace) => this.AbilitiesPerPlace.get(ability);

	public IsOnCooldown(ability: EAbility) {}

	public IsUsing(ability: EAbility) {}

	public CanFeint(ability: EAbility) {}
}
