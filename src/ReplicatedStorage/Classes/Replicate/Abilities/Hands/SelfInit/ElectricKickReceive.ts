import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

@ReplicateInfo({
	[EAnimations.ElectricKickReceive]: {
		SelfInit: true,
	},
})
export class ElectricKick extends CReplicate {}
