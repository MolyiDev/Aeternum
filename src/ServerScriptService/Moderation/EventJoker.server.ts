// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Moderation } from "./Moderation";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const GiveGems = Events.WaitForChild("Gems").WaitForChild("GiveGems") as RemoteEvent;

GiveGems.OnServerEvent.Connect((player) => {
	Moderation.BanPlayer(player.UserId, undefined, "Trying to fire remote events", 0);
});
