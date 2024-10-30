// Imports
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";
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
		const Abilities = character.Abilities;

		Model.Abilities.FindFirstChild(abilityPlace)?.Destroy();
		Abilities.Remove(abilityPlace);

		AbilityRemoved.FireAllClients(character, abilityPlace);
	}

	public static AddAbility(character: Character, abilityPlace: EAbilityPlace, ability: EAbility) {
		const Model = character.Model;
		const Abilities = character.Abilities;
		const AbilityModule = AbilitiesPerName.get(ability)!.Clone();

		AbilityModule.Name = abilityPlace;
		AbilityModule.Parent = Model.Abilities;
		Abilities.Add(abilityPlace, ability);

		AbilityAdded.FireAllClients(character, abilityPlace, ability);
	}
}
