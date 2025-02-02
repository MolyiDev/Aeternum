// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";

const ReceiveAttackInfo = {
	["ReceiveAttackNumbers"]: {
		SelfInit: true,
		ReplicateStunned: true,
	},
};

@ReplicateInfo(ReceiveAttackInfo)
export class ReceiveAttackNumbers extends CReplicate {
	public FiredReplicate(number: number): void {}

	public Destroy(): void {
		super.Destroy();
	}
}
