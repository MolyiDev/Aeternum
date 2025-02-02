import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import Signal from "@rbxts/lemon-signal";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { CAbility } from "../Abstracts/CAbility";
import { Players, RunService } from "@rbxts/services";

// Interfaces
interface PlaceWeapon {
	Place: number;
	Weapon: EWeapon;
}

export class Abilities {
	private Character: Character;

	public AbilitiesFolder: Folder;

	private ModuleAbilities = new Map<number | string, Map<EWeapon | string, CAbility>>();

	public AbilitiesPerPlace: Map<number, Map<EWeapon | string, EAbility | string>>;
	private PlacesPerAbility: Map<EAbility | string, PlaceWeapon>; // Reverse to clean AbilitiesPerPlace on undefined
	public AbilitiesFeint: Set<EAbility | string>;
	private Abilities: Set<EAbility | string>;

	public AbilityAdded: Signal<[number, EWeapon, EAbility | string]>;
	public AbilityRemoved: Signal<[number, EWeapon, EAbility | string]>;

	constructor(character: Character) {
		this.Character = character;

		this.AbilitiesFolder = character.Model.WaitForChild("Abilities") as Folder;

		this.AbilitiesPerPlace = new Map();
		this.PlacesPerAbility = new Map();
		this.AbilitiesFeint = new Set();
		this.Abilities = new Set();

		this.AbilityAdded = new Signal();
		this.AbilityRemoved = new Signal();

		character.Butler.Connect(this.AbilitiesFolder.AttributeChanged, (attribute) =>
			this.AbilitiesChanged(attribute),
		);
		this.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => this.AbilitiesChanged(ability));
	}

	public Start(ability: number | string) {
		const AbilityPerWeapon = this.ModuleAbilities.get(ability);
		if (!AbilityPerWeapon) return;
		const AbilityModule = AbilityPerWeapon.get(this.Character.Weapons.EquippedWeapon);
		if (!AbilityModule) return;

		const Ability = AbilityModule.Ability!;

		if (tick() - this.Character.Attributes.TickAnim(Ability) < ModuleManager.GetAbilityInfo(Ability)!.Cooldown)
			return;

		AbilityModule.Start();
	}

	public Has = (ability: string) => this.Abilities.has(ability);

	public AbilitiesChanged(abilityName: string) {
		const abilityPlace = this.AbilitiesFolder.GetAttribute(abilityName) as number;
		if (!abilityPlace) {
			this.Abilities.delete(abilityName);
			const PlacesPerAbility = this.PlacesPerAbility.get(abilityName);
			if (!PlacesPerAbility) return;

			const AbilityPlace = this.AbilitiesPerPlace.get(PlacesPerAbility.Place);
			if (AbilityPlace) {
				AbilityPlace.delete(PlacesPerAbility.Weapon);

				this.AbilityRemove(abilityPlace, PlacesPerAbility.Weapon);

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

		if (
			(RunService.IsClient() && (!this.Character.Player || this.Character.Player !== Players.LocalPlayer)) ||
			(RunService.IsServer() && this.Character.Player)
		) {
			this.AbilityAdded.Fire(numberAtt, AbilityInfo.Weapon, abilityName);
			return;
		}

		this.AbilityAdd(abilityPlace, AbilityInfo.Weapon, abilityName);
		this.AbilityAdded.Fire(numberAtt, AbilityInfo.Weapon, abilityName);
	}

	private AbilityAdd(abilityPlace: number, weapon: EWeapon | string, ability: EAbility | string) {
		let AbilityPlaces = this.ModuleAbilities.get(abilityPlace);
		if (!AbilityPlaces) {
			this.ModuleAbilities.set(abilityPlace, new Map<EWeapon, CAbility>());
			AbilityPlaces = this.ModuleAbilities.get(abilityPlace)!;
		} else if (AbilityPlaces.has(weapon)) return;

		const Ability = new (ModuleManager.GetAbility(ability))(this.Character);

		AbilityPlaces.set(weapon, Ability);
	}

	private AbilityRemove = (abilityPlace: number, weapon: EWeapon) =>
		this.ModuleAbilities.get(abilityPlace)?.delete(weapon);

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
