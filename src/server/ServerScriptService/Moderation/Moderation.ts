// Imports
import { DataStoreService, Players } from "@rbxts/services";
import { BanInfo } from "./Interfaces/BanInfo.server";

// Variables
const BannedPlayersList = DataStoreService.GetDataStore("BannedPlayers");
const BannedPlayers = new Map<number, BanInfo>();

export class Moderation {
	public static BanPlayer(userId: number, bannerId: number | undefined, reason: string, duration: number) {
		const banTime = os.time();
		const banInfo: BanInfo = {
			UserId: userId,
			BannerId: bannerId,
			Reason: reason,
			BanTime: banTime,
			Duration: duration,
		};

		BannedPlayers.set(userId, banInfo);
		const [success, err] = pcall(() => BannedPlayersList.SetAsync("BannedList", [...BannedPlayers]));
		if (success) {
			print(`MODERATION | Player Banned. ${banInfo}`);
			const player = Players.GetPlayerByUserId(userId);
			if (!player) return;
			const bannerName = bannerId ? Players.GetNameFromUserIdAsync(bannerId) : "Server";
			player.Kick(`You are banned. Reason: ${banInfo.Reason}. Time Left: ${duration}s. Banner: ${bannerName}`);
		} else warn(`MODERATION | Error on banning player: ${err}. ${banInfo}`);
	}

	public static UnBanPlayer(userId: number, unBanner: Player | undefined) {
		if (!BannedPlayers.has(userId)) return;

		BannedPlayers.delete(userId);
		const [success, err] = pcall(() => BannedPlayersList.SetAsync("BannedList", [...BannedPlayers]));
		if (success) {
			print(`Jugador con UserId ${userId} ha sido desbaneado.`);
		} else {
			warn(`Error al desbanear al jugador: ${err}`);
		}
	}

	public static KickPlayer(player: Player, kicker: Player | undefined, reason: string) {
		const kickerName = kicker ? kicker.Name : "Server";
		player.Kick(`You were kicked by: '${kickerName}' | Reason: ${reason}`);
	}
}

const [success, result] = pcall(() => BannedPlayersList.GetAsync("BannedList"));
if (success && result) {
	const bannedList = result as BanInfo[];
	for (const banInfo of bannedList) BannedPlayers.set(banInfo.UserId, banInfo);
} else warn("MODERATION | Can't load banned player list");

Players.PlayerAdded.Connect((player: Player) => {
	const userId = player.UserId;
	const banInfo = BannedPlayers.get(userId);

	if (!banInfo) return;
	const currentTime = os.time();
	const timeSinceBan = currentTime - banInfo.BanTime;

	if (timeSinceBan >= banInfo.Duration) Moderation.UnBanPlayer(userId, undefined);
	else {
		const timeLeft = banInfo.Duration - timeSinceBan;
		const bannerName = banInfo.BannerId ? Players.GetNameFromUserIdAsync(banInfo.BannerId) : "Server";
		player.Kick(`You are banned. Reason: ${banInfo.Reason}. Time Left: ${timeLeft}s. Banner: ${bannerName}`);
	}
});
