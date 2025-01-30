// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EDashDirection } from "ReplicatedStorage/Enums/Dash/EDashDirection";
import { EDashMode } from "ReplicatedStorage/Enums/Dash/EDashMode";
import { Default_Hands_RunAttackInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_RunAttack";

const DASH_DURATION = 0.4;
const DASH_START_SPEED = 45;
const DASH_END_SPEED = 5;

@ReplicateInfo(Default_Hands_RunAttackInfo)
export class Default_Hands_RunAttack extends CReplicate {
	public SelfAnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.States.SetState(EMovementState.Attacking, true);

		this.Tweens.SetDash({
			Direction: EDashDirection.Forward,
			Mode: this.Attributes.IsCameraLocked() ? EDashMode.Locked : EDashMode.Root,
			Time: DASH_DURATION,
			InitialSpeed: DASH_START_SPEED,
			FinalSpeed: DASH_END_SPEED,
			Stun: true,
		});
	}

	public SelfAnimStop(animTrack: AnimationTrack, animName: string): void {
		this.States.SetState(EMovementState.Attacking, false);
	}
}
