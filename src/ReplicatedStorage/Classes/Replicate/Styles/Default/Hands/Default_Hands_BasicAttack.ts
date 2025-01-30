// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Default_Hands_BasicAttackInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_BasicAttack";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const TIINFO = new TweenInfo(0.25, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
const NumberSequenceIn = new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 1)]);
const NumberSequenceOut = new NumberSequence([new NumberSequenceKeypoint(0, 1), new NumberSequenceKeypoint(1, 1)]);

@ReplicateInfo(Default_Hands_BasicAttackInfo)
export class Default_Hands_BasicAttack extends CReplicate {
	private Marks: Array<RBXScriptConnection> = [];
	private Animation: string = "";
	private SelfAnimation: string = "";

	public SelfAnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.SelfAnimation = animName;
		this.States.SetState(EMovementState.Attacking, true, 0.1);
		this.Tweens.SetSpeed(EMovementSpeeds.Punch, 0.35);
	}

	public SelfAnimStop(animTrack: AnimationTrack, animName: string): void {
		if (this.SelfAnimation !== animName) return;
		this.Tweens.SetSpeed(EMovementSpeeds.Default, 0.35);
		this.States.SetState(EMovementState.Attacking, false);
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack, animName: string): void {
		if (animName !== EAnimations.Default_Hands_AttackCombo) {
			this.Marks.push(
				this.Butler.Connect(animTrack.GetMarkerReachedSignal("Guard"), () =>
					this.Styles.Start(EStyleType.Guard),
				),
			);

			this.Marks.push(
				this.Butler.Connect(animTrack.GetMarkerReachedSignal("EndAttack"), () => {
					if (this.SelfAnimation !== animName) return;
					this.Tweens.SetSpeed(EMovementSpeeds.Default, 0.35);
					this.States.SetState(EMovementState.Attacking, false);
				}),
			);

			return;
		}

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

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.Animation = animName;
		Tools.TweenTransparency(this.Model.LeftHand.Trail1.Trail, TIINFO, NumberSequenceIn);
		Tools.TweenTransparency(this.Model.LeftHand.Trail2.Trail, TIINFO, NumberSequenceIn);
		Tools.TweenTransparency(this.Model.RightHand.Trail1.Trail, TIINFO, NumberSequenceIn);
		Tools.TweenTransparency(this.Model.RightHand.Trail2.Trail, TIINFO, NumberSequenceIn);
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		if (this.Animation !== animName) return;
		Tools.TweenTransparency(this.Model.LeftHand.Trail1.Trail, TIINFO, NumberSequenceOut);
		Tools.TweenTransparency(this.Model.LeftHand.Trail2.Trail, TIINFO, NumberSequenceOut);
		Tools.TweenTransparency(this.Model.RightHand.Trail1.Trail, TIINFO, NumberSequenceOut);
		Tools.TweenTransparency(this.Model.RightHand.Trail2.Trail, TIINFO, NumberSequenceOut);
	}

	public Destroy(): void {
		this.Butler.RemoveList(this.Marks);
		this.Marks.clear();
		this.Marks = undefined!;
		this.Animation = undefined!;
		this.SelfAnimation = undefined!;
		super.Destroy();
	}
}
