// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { Default_Hands_BlockInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Block";

@ReplicateInfo(Default_Hands_BlockInfo)
export class Default_Hands_Block extends CReplicate {
	public StateChanged: RBXScriptConnection = undefined!;
	public AnimationBottom: AnimationTrack = undefined!;

	public SelfConstruct(): void {
		this.AnimationBottom = this.Animations.GetAnimation(EAnimations.Default_Hands_BlockBottom);
	}

	public SelfAnimPlay(animTrack: AnimationTrack, animName: string): void {
		if (animName === EAnimations.Default_Hands_BlockBottom) return;
		this.Tweens.SetSpeed(EMovementSpeeds.Blocking, 0.2);
		this.Tweens.SetJump(EMovementJumps.Blocking, 0.2);
		this.States.SetState(EMovementState.Blocking, true);

		if (!this.States.IsInState(EMovementState.Walking)) this.AnimationBottom.Play(0.25, 1, 1.4);

		this.StateChanged = this.Butler.Connect(this.States.StateChanged, (oldState, newState) => {
			if (newState === EMovementState.Blocking) this.AnimationBottom.Play(0.5);
			else this.AnimationBottom.Stop(0.5);
		});
	}

	public SelfAnimStop(animTrack: AnimationTrack, animName: string): void {
		if (animName === EAnimations.Default_Hands_BlockBottom) return;
		this.Tweens.SetSpeed(EMovementSpeeds.Default, 0.2);
		this.Tweens.SetJump(EMovementJumps.Default, 0.2);
		this.States.SetState(EMovementState.Blocking, false);
		this.AnimationBottom.Stop(0.5);

		this.Butler.Remove(this.StateChanged);
	}

	public Destroy(): void {
		this.Butler.Remove(this.StateChanged);
		this.StateChanged = undefined!;
		this.AnimationBottom = undefined!;
		super.Destroy();
	}
}
