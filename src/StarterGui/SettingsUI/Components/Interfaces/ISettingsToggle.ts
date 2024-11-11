import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsToggle extends ISettingsDefault {
	initialValue: boolean;
	ToggleChanged: (activated: boolean) => void;
}
