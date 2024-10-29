// Imports
import { Players, ReplicatedStorage, ServerScriptService } from "@rbxts/services";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";
import { IModel } from "shared/Interfaces/IModel";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityRemoved = Events.WaitForChild("AbilityRemoved") as RemoteEvent;
const AbilityAdded = Events.WaitForChild("AbilityAdded") as RemoteEvent;

// Variables
const AbilitiesFolder = ServerScriptService.WaitForChild("Abilities").WaitForChild("Client");
const Abilities = new Map<string, ModuleScript>();

for (const ability of AbilitiesFolder.GetDescendants()) {
	if (!ability.IsA("ModuleScript")) continue;
	Abilities.set(ability.Name, ability);
}

export class AbilityManager {
	public static RemoveAbility(character: IModel, abilityPlace: EAbilityPlace) {
		character.Abilities.FindFirstChild(abilityPlace)?.Destroy();
		// Remove accessory
		const Player = Players.GetPlayerFromCharacter(character);
		if (!Player) return;
		AbilityRemoved.FireClient(Player, abilityPlace);
	}

	public static AddAbility(character: IModel, abilityPlace: EAbilityPlace, ability: EAbility) {
		const AbilityModule = Abilities.get(ability)!.Clone();
		AbilityModule.Name = abilityPlace;
		AbilityModule.Parent = character.Abilities;
		// Add accessory
		const Player = Players.GetPlayerFromCharacter(character);
		if (!Player) return;
		AbilityAdded.FireClient(Player, abilityPlace);
	}
}
