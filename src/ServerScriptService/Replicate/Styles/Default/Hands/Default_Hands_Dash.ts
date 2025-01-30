// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { Default_Hands_DashInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Dash";

@ReplicateInfo(Default_Hands_DashInfo)
export class Default_Hands_Dash extends CReplicate {
	public MarkStart: RBXScriptConnection = undefined!;
	public MarkEnd: RBXScriptConnection = undefined!;

	public AnimPlay() {
		if (!this.States.IsGrounded()) return;
		this.Attributes.SetIsDashing(true);
	}

	public AnimStop() {
		this.Attributes.SetIsDashing(false);
	}

	public Destroy() {
		this.Butler.RemoveList(this.MarkStart, this.MarkEnd);

		this.MarkStart = undefined!;
		this.MarkEnd = undefined!;
	}
}
