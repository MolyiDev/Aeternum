// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Moderation } from "./Moderation";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const GiveGems = Events.WaitForChild("Gems").WaitForChild("GiveGems") as RemoteEvent;

GiveGems.OnServerEvent.Connect((player) => {
	Moderation.BanPlayers(
		[player.UserId],
		-1,
		"Exploiter | Trying to fire remote events",
		"Exploiter | Trying to fire remote events | EventJoker",
	);
});
