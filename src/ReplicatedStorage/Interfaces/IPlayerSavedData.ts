export interface IPlayerSavedData {
	Audio?: {
		[key: string]: boolean | number;
	};
	Controls?: {
		[key: string]: undefined;
	};
	Visual?: {
		[key: string]: boolean | number;
	};

	General?: {
		[key: string]: boolean | number;
	};
}
