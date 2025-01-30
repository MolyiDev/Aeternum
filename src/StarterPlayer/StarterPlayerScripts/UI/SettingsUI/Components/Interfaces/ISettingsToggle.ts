import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsToggle extends ISettingsDefault {
	InitialValue: boolean;
	LayoutOrder: number;
	ToggleChanged: (activated: boolean) => void;
}
