// Imports
import { PhysicsService, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { NPCManager } from "ReplicatedStorage/Managers/NPCManager";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { AbilityManager } from "./Managers/AbilityManager";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { ECollisionGroup } from "ReplicatedStorage/Enums/ECollisionGroup";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { StylesManager } from "./Managers/StylesManager";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";

Players.CharacterAutoLoads = false;

// Events
const PlayEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Play") as RemoteEvent;

// Physics
PhysicsService.RegisterCollisionGroup(ECollisionGroup.Player);
PhysicsService.RegisterCollisionGroup(ECollisionGroup.RockDebris);
PhysicsService.RegisterCollisionGroup(ECollisionGroup.PlayerNoCollision);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.Player, ECollisionGroup.Player, true);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.Player, false);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.RockDebris, ECollisionGroup.RockDebris, false);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.PlayerNoCollision, ECollisionGroup.Player, false);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.PlayerNoCollision, ECollisionGroup.PlayerNoCollision, false);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.PlayerNoCollision, ECollisionGroup.RockDebris, false);
SettingsManager.Initialize();

// Variables
const SimulatedJoints = new Set<string>(["Shoulder", "Elbow", "Wrist"]);
const CharactersFolder = Workspace.WaitForChild("Characters");

const Map = Workspace.Terrain.WaitForChild("Map").GetDescendants();

for (const part of Map) {
	if (!part.IsA("Part")) continue;
	part.AddTag("Destroyable");
}

task.delay(5, () => {
	const NPCModelFolder = CharactersFolder.WaitForChild("NPC");
	for (const npc of NPCModelFolder.GetChildren()) {
		if (!npc.IsA("Model")) continue;
		NPCManager.RegisterNPC(npc as IModel);
		task.wait(0.25);
	}
});

CharacterManager.AddedCharacter.Connect((character) => {
	const Model = character.Model;

	for (const Joint of Model.GetDescendants()) {
		if (!SimulatedJoints.has(Joint.Name) || !Joint.IsA("AnimationConstraint")) continue;
		Joint.IsKinematic = false;
		Joint.MaxTorque = 700;
	}

	StylesManager.ChangeStyle(character, EStyle.Default);

	if (!character.Player) {
		//MovementTracker.TrackMovement(character);
		return;
	}

	Model.Parent = CharactersFolder;
	AbilityManager.AddAbility(character, 1, EAbility.SeriousPunch);
	AbilityManager.AddAbility(character, 2, EAbility.ElectricKick);
	AbilityManager.AddAbility(character, 3, EAbility.GroundSmash);
	//AbilityManager.AddAbility(character, 4, EAbility.InfernalThrow);
	//WeaponManager.AddWeapon(character, EWeapon.Sword);
});

PlayEvent.OnServerEvent.Connect((player: Player) => {
	if (player.Character) return;
	player.LoadCharacter();
});
