/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Players } from "@rbxts/services";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { ControlManager } from "../Managers/ControlsManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { IAbility } from "shared/Interfaces/IAbility";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EWeapons } from "shared/Enums/EWeapons";

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Abilities = Character.Abilities;
const Model = Character.Model;
const Attributes = Character.Attributes;
const Butler = Character.Butler;

const ModuleAbilities = new Map<EAbilityPlace, Map<EWeapons, IAbility>>();

function AbilityStart(ability: EAbilityPlace) {
	const AbilityPerWeapon = ModuleAbilities.get(ability);
	if (!AbilityPerWeapon) return;
	const AbilityModule = AbilityPerWeapon.get(EWeapons.Hands);
	if (!AbilityModule) return;

	const Ability = AbilityModule.GetAbility();
	const UsedTick = Attributes.TickAbility(Ability);

	if (tick() - UsedTick < EAbilityInfo[Ability].Cooldown) return;

	AbilityModule.Start();
}

function AbilityAdd(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
	let AbilityPlaces = ModuleAbilities.get(abilityPlace);
	if (!AbilityPlaces) {
		ModuleAbilities.set(abilityPlace, new Map<EWeapons, IAbility>());
		AbilityPlaces = ModuleAbilities.get(abilityPlace)!;
	}
	AbilityPlaces.set(weapon, require(Model.Abilities.WaitForChild(ability) as ModuleScript) as IAbility);
}

function AbilityRemove(abilityPlace: EAbilityPlace, weapon: EWeapons) {
	ModuleAbilities.get(abilityPlace)?.delete(weapon);
}

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Ability1:
			AbilityStart(EAbilityPlace.Ability1);
			break;
		case ESettingsControls.Ability2:
			AbilityStart(EAbilityPlace.Ability2);
			break;
		case ESettingsControls.Ability3:
			AbilityStart(EAbilityPlace.Ability3);
			break;
		case ESettingsControls.Ability4:
			AbilityStart(EAbilityPlace.Ability4);
			break;
	}
}

Butler.Connect(
	ControlManager.LocalInputBegan,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) =>
		InputBegan(control, input, doublePressed),
);

Butler.Connect(Abilities.AbilityAdded, (abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) =>
	AbilityAdd(abilityPlace, weapon, ability),
);

Butler.Connect(Abilities.AbilityRemoved, (abilityPlace: EAbilityPlace, weapon: EWeapons) =>
	AbilityRemove(abilityPlace, weapon),
);
