import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsDragger extends ISettingsDefault {
	initialValue: number;
	minDrag: number;
	maxDrag: number;
	dragAmount: number;
	layoutOrder?: number;
	textModifier: string;
	ValueChanged: (value: number) => void;
}
