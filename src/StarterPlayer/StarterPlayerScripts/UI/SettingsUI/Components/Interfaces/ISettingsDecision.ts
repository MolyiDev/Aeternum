import { ISettingsDefault } from "./ISettingsDefault";

export interface ISettingsDecision extends ISettingsDefault {
	InitialValue: number;
	LayoutOrder: number;
	OptionOne: string;
	OptionTwo: string;
	OptionThree?: string;
	DecisionChanged: (decision: number) => void;
}
