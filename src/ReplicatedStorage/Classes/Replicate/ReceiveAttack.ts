// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";

const ReceiveAttackInfo = {
	[EAnimations.ReceiveAttack1]: {
		Receive: true,
		Sound: true,
		ReplicateStunned: true,
	},
	[EAnimations.ReceiveAttack2]: {
		Receive: true,
		Sound: true,
		ReplicateStunned: true,
	},
	[EAnimations.ReceiveAttack3]: {
		Receive: true,
		Sound: true,
		ReplicateStunned: true,
	},
	[EAnimations.ReceiveAttack4]: {
		Receive: true,
		Sound: true,
		ReplicateStunned: true,
	},
};

@ReplicateInfo(ReceiveAttackInfo)
export class ReceiveAttack extends CReplicate {
	public SelfAnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.Tweens.GetCameraShaker().ShakeOnce(4, 8, 0, 0.55);
	}

	public Destroy(): void {
		super.Destroy();
	}
}
