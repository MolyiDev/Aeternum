// Imports
import { ServerScriptService } from "@rbxts/services";
import { Character } from "shared/Classes/Character";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAbilityPlace } from "shared/Enums/Abilities/EAbilityPlace";

// Variables
const AbilitiesFolder = ServerScriptService.WaitForChild("Abilities").WaitForChild("Client");
const AbilitiesPerName = new Map<string, ModuleScript>();

for (const ability of AbilitiesFolder.GetDescendants()) {
	if (!ability.IsA("ModuleScript")) continue;
	AbilitiesPerName.set(ability.Name, ability);
}

export class AbilityManager {
	public static RemoveAbility(character: Character, ability: EAbility) {
		const Model = character.Model;

		Model.Abilities.FindFirstChild(ability)?.Destroy();
		Model.Abilities.SetAttribute(ability, undefined);
	}

	public static AddAbility(character: Character, abilityPlace: EAbilityPlace, ability: EAbility) {
		const Model = character.Model;
		const AbilityModule = AbilitiesPerName.get(ability)!.Clone();

		AbilityModule.Name = ability;
		AbilityModule.Parent = Model.Abilities;

		Model.Abilities.SetAttribute(ability, abilityPlace);
	}
}
