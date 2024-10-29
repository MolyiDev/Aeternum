/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ESettingsControls } from "shared/Enums/Settings/ESettingsControls";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { ControlManager } from "../Managers/ControlsManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { IAbility } from "shared/Interfaces/IAbility";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityRemovedEvent = Events.WaitForChild("AbilityRemoved") as RemoteEvent;
const AbilityAddedEvent = Events.WaitForChild("AbilityAdded") as RemoteEvent;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.GetCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Model = Character.Model;
const Attributes = Character.Attributes;
const Janitor = Character.Janitor;

const ModuleAbilities = new Map<EAbilityPlace, IAbility>();

function AbilityStart(ability: EAbilityPlace) {
	const AbilityModule = ModuleAbilities.get(ability);
	if (!AbilityModule) return;

	const Ability = AbilityModule.GetAbility();
	const UsedTick = Attributes.TickAbility(Ability);

	if (tick() - UsedTick < EAbilityInfo[Ability].Cooldown) return;

	AbilityModule.Start();
}

function AbilityAdd(ability: EAbilityPlace) {
	ModuleAbilities.set(ability, require(Model.Abilities.WaitForChild(ability) as ModuleScript) as IAbility);
}

function AbilityRemove(ability: EAbilityPlace) {
	ModuleAbilities.delete(EAbilityPlace.Ability1);
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

function AbilityAdded(abilityPlace: string) {
	switch (abilityPlace) {
		case EAbilityPlace.Ability1:
			AbilityAdd(EAbilityPlace.Ability1);
			break;
		case EAbilityPlace.Ability2:
			AbilityAdd(EAbilityPlace.Ability2);
			break;
		case EAbilityPlace.Ability3:
			AbilityAdd(EAbilityPlace.Ability3);
			break;
		case EAbilityPlace.Ability4:
			AbilityAdd(EAbilityPlace.Ability4);
			break;
	}
}

function AbilityRemoved(abilityPlace: string) {
	switch (abilityPlace) {
		case EAbilityPlace.Ability1:
			AbilityRemove(EAbilityPlace.Ability1);
			break;
		case EAbilityPlace.Ability2:
			AbilityRemove(EAbilityPlace.Ability2);
			break;
		case EAbilityPlace.Ability3:
			AbilityRemove(EAbilityPlace.Ability3);
			break;
		case EAbilityPlace.Ability4:
			AbilityRemove(EAbilityPlace.Ability4);
			break;
	}
}

Janitor.Add(
	ControlManager.LocalInputBegan.Connect(
		(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) =>
			InputBegan(control, input, doublePressed),
	),
	"Disconnect",
);

Janitor.Add(AbilityAddedEvent.OnClientEvent.Connect((abilityPlace: string) => AbilityAdded(abilityPlace)));
Janitor.Add(AbilityRemovedEvent.OnClientEvent.Connect((abilityPlace: string) => AbilityRemoved(abilityPlace)));
