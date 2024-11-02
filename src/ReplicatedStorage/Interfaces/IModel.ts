import { IHumanoid } from "./IHumanoid";

export interface IModel extends Model {
	Abilities: Folder;
	Humanoid: IHumanoid;
	Head: BasePart;
	Neck: BasePart;
	Waist: BasePart;
	RightHand: BasePart;
	LeftHand: BasePart;
	UpperTorso: BasePart;
	LowerTorso: BasePart;
	LeftFoot: BasePart;
	RightFoot: BasePart;
	Highlight: Highlight;
}
