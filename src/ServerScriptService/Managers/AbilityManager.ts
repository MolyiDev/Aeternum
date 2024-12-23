// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityUse = Events.WaitForChild("AbilityUse") as RemoteEvent;

AbilityUse.OnServerEvent.Connect((player, ...args: Array<unknown>) => {
	if (args.size() < 1) return;
	const Ability = args[0] as EAbility;
	if (!Ability || Ability !== Ability || !typeIs(Ability, "string")) return;
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const Humanoid = Character.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0) return;
	const Abilities = Character.Abilities;
	if (!Abilities.Has(Ability)) return;
	Character.ReplicateServer.SignalFired(Ability);
});

export class AbilityManager {
	public static RemoveAbility = (character: Character, ability: EAbility) =>
		character.Model.Abilities.SetAttribute(ability, undefined);

	public static AddAbility = (character: Character, abilityPlace: number, ability: EAbility) =>
		character.Model.Abilities.SetAttribute(ability, abilityPlace);
}
