// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const StyleUse = Events.WaitForChild("StyleUse") as RemoteEvent;
const StyleUseConstant = Events.WaitForChild("StyleUseConstant") as UnreliableRemoteEvent;
const StyleUseFunction = Events.WaitForChild("StyleUseFunction") as RemoteFunction;

function StyleUsed(player: Player, ...args: Array<unknown>) {
	if (args.size() < 1) return;
	const StyleType = args[0] as EStyleType;
	if (!StyleType || StyleType !== StyleType || !typeIs(StyleType, "string")) return;
	const Character = CharacterManager.GetCharacterByModel(player.Character);
	if (!Character || Character.IsDestroyed) return;
	const Humanoid = Character.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0) return;
	return Character.ReplicateServer.SignalFired(
		`${Character.Styles.Style}_${Character.Weapons.EquippedWeapon}_${StyleType}`,
		...args,
	);
}

StyleUse.OnServerEvent.Connect((player, ...args: Array<unknown>) => StyleUsed(player, ...args));
StyleUseConstant.OnServerEvent.Connect((player, ...args: Array<unknown>) => StyleUsed(player, ...args));
StyleUseFunction.OnServerInvoke = (player, ...args: Array<unknown>) => StyleUsed(player, ...args);

export class StylesManager {
	public static ChangeStyle = (character: Character, style: EStyle) =>
		character.Model.Styles.SetAttribute("Style", style);
}
