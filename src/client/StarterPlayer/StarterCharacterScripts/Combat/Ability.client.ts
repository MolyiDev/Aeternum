/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { ControlManager } from "../Managers/ControlsManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { IAbility } from "shared/Interfaces/IAbility";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";
import { EAbility } from "shared/Enums/Abilities/EAbility";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityRemovedEvent = Events.WaitForChild("AbilityRemoved") as RemoteEvent;
const AbilityAddedEvent = Events.WaitForChild("AbilityAdded") as RemoteEvent;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Abilities = Character.Abilities;
const Model = Character.Model;
const Attributes = Character.Attributes;
const Butler = Character.Butler;

const ModuleAbilities = new Map<EAbilityPlace, IAbility>();

function AbilityStart(ability: EAbilityPlace) {
	const AbilityModule = ModuleAbilities.get(ability);
	if (!AbilityModule) return;

	const Ability = AbilityModule.GetAbility();
	const UsedTick = Attributes.TickAbility(Ability);

	if (tick() - UsedTick < EAbilityInfo[Ability].Cooldown) return;

	AbilityModule.Start();
}

function AbilityAdd(abilityPlace: EAbilityPlace, ability: EAbility) {
	ModuleAbilities.set(abilityPlace, require(Model.Abilities.WaitForChild(abilityPlace) as ModuleScript) as IAbility);
}

function AbilityRemove(abilityPlace: EAbilityPlace) {
	ModuleAbilities.delete(abilityPlace);
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

Butler.Connect(AbilityAddedEvent.OnClientEvent, (abilityPlace: EAbilityPlace, ability: EAbility) =>
	AbilityAdd(abilityPlace, ability),
);
Butler.Connect(AbilityRemovedEvent.OnClientEvent, (abilityPlace: EAbilityPlace) => AbilityRemove(abilityPlace));
