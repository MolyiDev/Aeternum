// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

const Default_Hands_ReceiveAttackComboInfo = {
	[EAnimations.Default_Hands_ReceiveAttackCombo]: {
		Receive: true,
		Sound: true,
		ReplicateStunned: true,
		Cooldown: 0,
		Class: "Default_Hands_ReceiveAttackCombo",
	},
};

@ReplicateInfo(Default_Hands_ReceiveAttackComboInfo)
export class Default_Hands_ReceiveAttackCombo extends CReplicate {
	private Marks: Array<RBXScriptConnection> = [];

	public SelfAnimPlayOnce(animTrack: AnimationTrack, animName: string): void {
		this.Marks.push(
			this.Butler.Connect(animTrack.GetMarkerReachedSignal("Attack"), (param) => {
				switch (param) {
					case "1":
					case "2":
					case "3":
						this.Tweens.GetCameraShaker().ShakeOnce(4, 8, 0, 0.8);
						break;
					case "4":
						this.Tweens.GetCameraShaker().ShakeOnce(5, 10, 0, 0.8);
						break;
					case "5":
						this.Tweens.GetCameraShaker().ShakeOnce(6, 10, 0, 0.85);
						break;
				}
			}),
		);
	}

	public Destroy(): void {
		this.Butler.RemoveList(this.Marks);
		this.Marks.clear();
		this.Marks = undefined!;
		super.Destroy();
	}
}
