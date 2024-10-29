// Imports
import { PhysicsService, Players, Workspace } from "@rbxts/services";
import { NPCManager } from "shared/Managers/NPCManager";
import { SettingsManager } from "shared/Managers/SettingsManager";
import { AbilityManager } from "./Managers/AbilitiesManager";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { IModel } from "shared/Interfaces/IModel";
import { ECollisionGroup } from "shared/Enums/ECollisionGroup";

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

Players.PlayerAdded.Connect((player) => {
	player.CharacterAdded.Connect((character) => {
		character.Parent = PlayersFolder;
		AbilityManager.AddAbility(character as IModel, EAbilityPlace.Ability1, EAbility.SeriousPunch);
		AbilityManager.AddAbility(character as IModel, EAbilityPlace.Ability2, EAbility.ElectricKick);
	});
});

Players.PlayerRemoving.Connect((player) => {});
