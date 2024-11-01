// Imports
import { PhysicsService, Players, Workspace } from "@rbxts/services";
import { NPCManager } from "shared/Managers/NPCManager";
import { SettingsManager } from "shared/Managers/SettingsManager";
import { AbilityManager } from "./Managers/AbilitiesManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { ECollisionGroup } from "shared/Enums/ECollisionGroup";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { IModel } from "shared/Interfaces/IModel";

PhysicsService.RegisterCollisionGroup(ECollisionGroup.RockDebris);
PhysicsService.RegisterCollisionGroup(ECollisionGroup.Player);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.Player, ECollisionGroup.Player, true);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.Player, false);
SettingsManager.Initialize();

// Variables
const CharactersFolder = Workspace.WaitForChild("Characters");

task.delay(5, () => {
	const NPCModelFolder = CharactersFolder.WaitForChild("NPC");
	for (const npc of NPCModelFolder.GetChildren()) {
		if (!npc.IsA("Model")) continue;
		NPCManager.RegisterNPC(npc as IModel);
		task.wait(0.25);
	}
});

CharacterManager.AddedCharacter.Connect((character) => {
	if (character.IsPlayer) character.Model.Parent = CharactersFolder;
	const player = Players.GetPlayerFromCharacter(character.Model);
	if (!player) return;
	task.wait(5);
	AbilityManager.AddAbility(character, EAbilityPlace.Ability1, EAbility.SeriousPunch);
	AbilityManager.AddAbility(character, EAbilityPlace.Ability2, EAbility.ElectricKick);
});
