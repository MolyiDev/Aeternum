import { IHumanoid } from "./IHumanoid";

interface TrailAttachment extends Attachment {
	Trail: Trail;
}

interface TrailHand extends BasePart {
	Trail1: TrailAttachment;
	Trail2: TrailAttachment;
}

export interface IModel extends Model {
	Abilities: Folder;
	Parameters: Folder;
	Styles: Folder;
	Weapons: Folder;
	Humanoid: IHumanoid;
	Head: BasePart;
	Neck: BasePart;
	Waist: BasePart;
	RightHand: TrailHand;
	LeftHand: TrailHand;
	UpperTorso: BasePart;
	LowerTorso: BasePart;
	LeftUpperLeg: BasePart;
	LeftLowerLeg: BasePart;
	LeftFoot: BasePart;
	RightUpperLeg: BasePart;
	RightLowerLeg: BasePart;
	RightFoot: BasePart;
	Highlight: Highlight;
}
