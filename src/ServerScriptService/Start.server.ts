// Imports
import { PhysicsService, Players, Workspace } from "@rbxts/services";
import { NPCManager } from "ReplicatedStorage/Managers/NPCManager";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { AbilityManager } from "./Managers/AbilitiesManager";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { ECollisionGroup } from "ReplicatedStorage/Enums/ECollisionGroup";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";

PhysicsService.RegisterCollisionGroup(ECollisionGroup.RockDebris);
PhysicsService.RegisterCollisionGroup(ECollisionGroup.Player);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.Player, ECollisionGroup.Player, true);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.Player, false);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.RockDebris, false);
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
	if (!character.IsPlayer) return;
	character.Model.Parent = CharactersFolder;
	task.wait(10);
	AbilityManager.AddAbility(character, 1, EAbility.SeriousPunch);
	AbilityManager.AddAbility(character, 2, EAbility.ElectricKick);
	AbilityManager.AddAbility(character, 3, EAbility.GroundSmash);
});
