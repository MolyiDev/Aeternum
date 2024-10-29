export enum ECustomInputs {
	All = "Settings_Controls_All",
	None = "Settings_Controls_None",
	WheelUp = "Settings_Controls_WheelUp",
	WheelDown = "Settings_Controls_WheelDown",
}

const enumEntries = [
	["All", ECustomInputs.All],
	["None", ECustomInputs.None],
	["WheelUp", ECustomInputs.WheelUp],
	["WheelDown", ECustomInputs.WheelDown],
];

export function ECustomInputsParse(value: string): string | undefined {
	for (const [key, val] of enumEntries) {
		if (val === value) return key;
	}
	return undefined;
}
