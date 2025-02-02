// Imports
import { Players } from "@rbxts/services";

export class Moderation {
	public static BanPlayers = (
		UserIds: Array<number>,
		Duration: number,
		DisplayReason: string,
		PrivateReason: string,
	) =>
		Players.BanAsync({
			UserIds: UserIds,
			Duration: Duration,
			DisplayReason: DisplayReason,
			PrivateReason: PrivateReason,
		});

	public static UnBanPlayers = (UserIds: Array<number>) => Players.UnbanAsync({ UserIds: UserIds });

	public static KickPlayer = (Player: Player, Reason: string) => Player.Kick(Reason);
}
