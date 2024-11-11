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

	DataGeneral?: {
		[key: string]: boolean | number;
	};
}
