import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsDragger extends ISettingsDefault {
	InitialValue: number;
	MinDrag: number;
	MaxDrag: number;
	TextMaxDigits?: number;
	DragAmount: number;
	LayoutOrder?: number;
	TextModifier: string;
	ValueChanged: (value: number) => void;
}
