export interface IPlayerSavedData {
	Audio?: {
		[key: string]: number;
	};
	Controls?: {
		[key: string]: undefined;
	};
	Visual?: {
		[key: string]: boolean;
	};
}
