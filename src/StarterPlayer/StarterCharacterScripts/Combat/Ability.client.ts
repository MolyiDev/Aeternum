/* eslint-disable @typescript-eslint/no-require-imports */
// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

// Events
const FeintEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Feint") as RemoteEvent;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Abilities = Character.Abilities;
const Attributes = Character.Attributes;
const Controls = Character.Controls;
const Butler = Character.Butler;

function InputBegan(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) {
	if (!control) return;
	switch (control[0]) {
		case ESettingsControls.Feint:
			{
				if (Attributes.IsStunnedFull()) return;
				const UsingAbility = Attributes.UsingAbilityAnim();
				if (!UsingAbility) return;
				const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingAbility);
				if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Abilities.AbilitiesFeint.has(UsingAbility)) return;
				const AnimAbility = Character.Animations.Animator.GetPlayingAnimationTracks().find(
					(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingAbility,
				);
				if (!AnimAbility) return;
				FeintEvent.FireServer(UsingAbility);
				if (Attributes.UsingAbility() === UsingAbility) return;
				AnimAbility.Stop(EGlobal.Feint);
			}
			break;
		case ESettingsControls.Ability1:
			Abilities.Start(1);
			break;
		case ESettingsControls.Ability2:
			Abilities.Start(2);
			break;
		case ESettingsControls.Ability3:
			Abilities.Start(3);
			break;
		case ESettingsControls.Ability4:
			Abilities.Start(4);
			break;
	}
}

Butler.Connect(
	Controls.InputBeganSignal,
	(control: [string, number] | undefined, input: InputObject, doublePressed: boolean) =>
		InputBegan(control, input, doublePressed),
);
