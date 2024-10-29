export interface BanInfo {
	UserId: number;
	BannerId: number | undefined;
	Reason: string;
	BanTime: number;
	Duration: number;
}
