// Imports
import { Players, ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { Character } from "shared/Classes/Character";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityRemoved = Events.WaitForChild("AbilityRemoved") as RemoteEvent;
const AbilityAdded = Events.WaitForChild("AbilityAdded") as RemoteEvent;

// Variables
const AbilitiesFolder = ServerScriptService.WaitForChild("Abilities").WaitForChild("Client");
const AbilitiesPerName = new Map<string, ModuleScript>();

for (const ability of AbilitiesFolder.GetDescendants()) {
	if (!ability.IsA("ModuleScript")) continue;
	AbilitiesPerName.set(ability.Name, ability);
}

export class AbilityManager {
	public static RemoveAbility(character: Character, abilityPlace: EAbilityPlace) {
		const Model = character.Model;

		Model.Abilities.FindFirstChild(abilityPlace)?.Destroy();

		const Player = Players.GetPlayerFromCharacter(character.Model);
		if (!Player) return;
		AbilityRemoved.FireClient(Player, abilityPlace);
	}

	public static AddAbility(character: Character, abilityPlace: EAbilityPlace, ability: EAbility) {
		const Model = character.Model;
		const AbilityModule = AbilitiesPerName.get(ability)!.Clone();

		AbilityModule.Name = abilityPlace;
		AbilityModule.Parent = Model.Abilities;

		const Player = Players.GetPlayerFromCharacter(character.Model);
		if (!Player) return;
		AbilityAdded.FireClient(Player, abilityPlace, ability);
	}
}
