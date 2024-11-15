/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ControlManager } from "../Managers/ControlsManager";
import { EAbilityPlace } from "ReplicatedStorage/Enums/Abilities/EAbilityPlace";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { EAbilityInfo } from "ReplicatedStorage/Enums/Abilities/EAbilityInfo";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";

// Events
const FeintEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Feint") as RemoteEvent;

// Constants
const FEINT_OUT = 0.1;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Animations = Character.Animations;
const Abilities = Character.Abilities;
const Attributes = Character.Attributes;
const Butler = Character.Butler;

const ModuleAbilities = new Map<EAbilityPlace, Map<EWeapons, IAbility>>();

function AbilityStart(ability: EAbilityPlace) {
	const AbilityPerWeapon = ModuleAbilities.get(ability);
	if (!AbilityPerWeapon) return;
	const AbilityModule = AbilityPerWeapon.get(EWeapons.Hands);
	if (!AbilityModule) return;

	const Ability = AbilityModule.GetAbility();
	const UsedTick = Attributes.TickAnim(Ability);

	if (tick() - UsedTick < EAbilityInfo[Ability].Cooldown) return;

	AbilityModule.Start();
}

function AbilityAdd(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
	let AbilityPlaces = ModuleAbilities.get(abilityPlace);
	if (!AbilityPlaces) {
		ModuleAbilities.set(abilityPlace, new Map<EWeapons, IAbility>());
		AbilityPlaces = ModuleAbilities.get(abilityPlace)!;
	}

	const Ability = new (ModuleManager.GetAbility(ability))(Character);

	AbilityPlaces.set(weapon, Ability);
}

function AbilityRemove(abilityPlace: EAbilityPlace, weapon: EWeapons) {
	ModuleAbilities.get(abilityPlace)?.delete(weapon);
}

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Feint:
			{
				if (Attributes.IsStunnedFull()) return;
				const UsingAbility = Attributes.UsingAbilityAnim();
				if (!UsingAbility) return;
				const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingAbility);
				if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Abilities.AbilitiesFeint.get(UsingAbility)) return;
				const AnimAbility = Character.Animations.Animator.GetPlayingAnimationTracks().find(
					(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingAbility,
				);
				if (!AnimAbility) return;
				FeintEvent.FireServer(UsingAbility);
				if (Attributes.UsingAbility() === UsingAbility) return;
				AnimAbility.Stop(EStopGlobal);
			}
			break;
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
