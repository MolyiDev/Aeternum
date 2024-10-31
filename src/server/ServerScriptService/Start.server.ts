// Imports
import { PhysicsService, Workspace } from "@rbxts/services";
import { NPCManager } from "shared/Managers/NPCManager";
import { SettingsManager } from "shared/Managers/SettingsManager";
import { AbilityManager } from "./Managers/AbilitiesManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { ECollisionGroup } from "shared/Enums/ECollisionGroup";
import { CharacterManager } from "shared/Managers/CharacterManager";

PhysicsService.RegisterCollisionGroup(ECollisionGroup.RockDebris);
PhysicsService.RegisterCollisionGroup(ECollisionGroup.Player);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.Player, ECollisionGroup.Player, true);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.Player, false);
SettingsManager.Initialize();

// Variables
const PlayersFolder = Workspace.WaitForChild("Players");

task.delay(5, () => {
	const NPCModelFolder = Workspace.WaitForChild("NPC");
	for (const npc of NPCModelFolder.GetChildren()) {
		if (!npc.IsA("Model")) continue;
		NPCManager.RegisterNPC(npc);
		task.wait(0.25);
	}
});

CharacterManager.AddedCharacter.Connect((character) => {
	character.Model.Parent = PlayersFolder;
	const AbilitiesFolder = new Instance("Folder", character.Model);
	AbilitiesFolder.Name = "Abilities";
	AbilityManager.AddAbility(character, EAbilityPlace.Ability1, EAbility.SeriousPunch);
	AbilityManager.AddAbility(character, EAbilityPlace.Ability2, EAbility.ElectricKick);
});
