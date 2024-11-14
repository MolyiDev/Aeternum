import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsToggle extends ISettingsDefault {
	initialValue: boolean;
	layoutOrder: number;
	ToggleChanged: (activated: boolean) => void;
}
