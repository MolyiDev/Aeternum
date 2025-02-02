// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { ElectricKickInfo } from "ReplicatedStorage/Abilities/Hands/ElectricKick";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";
import RockLibrary from "ReplicatedStorage/Libraries/RockLibrary";

@ReplicateInfo(ElectricKickInfo)
export class ElectricKick extends CReplicate {
	public SelfMarkRockHand: RBXScriptConnection = undefined!;
	public SelfMarkRockDown: RBXScriptConnection = undefined!;
	public SelfMarkDamage: RBXScriptConnection = undefined!;
	public MarkRockHand: RBXScriptConnection = undefined!;
	public MarkRockDown: RBXScriptConnection = undefined!;
	public MarkDamage: RBXScriptConnection = undefined!;

	Destroy() {
		this.Butler.RemoveList(
			this.SelfMarkRockHand,
			this.SelfMarkRockDown,
			this.SelfMarkDamage,
			this.MarkRockHand,
			this.MarkRockDown,
		);

		this.SelfMarkRockHand = undefined!;
		this.SelfMarkRockDown = undefined!;
		this.SelfMarkDamage = undefined!;
		this.MarkRockHand = undefined!;
		this.MarkRockDown = undefined!;

		super.Destroy();
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack) {
		this.SelfMarkRockHand = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			if (!this.Attributes.UsingAbility()) return;

			this.Tweens.GetCameraShaker().ShakeOnce(4, 8, 0, 0.8);
		});

		this.SelfMarkRockHand = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () =>
			this.Tweens.GetCameraShaker().ShakeOnce(5, 10, 0, 0.8),
		);

		this.SelfMarkDamage = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Damage"), () =>
			this.Tweens.GetCameraShaker().ShakeOnce(3, 6, 0, 0.5),
		);
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		this.MarkRockHand = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			if (!this.CanReplicate()) return;
			const CF = this.Model.RightHand.CFrame;
			RockLibrary.Crater(CF, 2, 0.35, 6, 1, 2, 0, 0.2, 2, false);

			if (!this.Attributes.UsingAbility()) {
				animTrack.Stop(EGlobal.Feint);
				return;
			}

			RockLibrary.Explosion(CF.Position, 0.35, 40, 20, 4);
			RockLibrary.Line(this.HumanoidRootPart.CFrame, 10, 5, 2, 20, 1, 8, 20, 4, 0.45, 3, 0.01);
		});

		this.MarkRockDown = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () => {
			if (!this.CanReplicate()) return;
			const CF = this.HumanoidRootPart.CFrame;
			RockLibrary.Explosion(CF.Position, 0.45, 45, 30, 4);
			RockLibrary.Crater(CF, 4, 0.8, 8, 2, 4, 4, 0.3, 3, true, 0.5);
			task.delay(0.05, () => RockLibrary.Crater(CF, 8, 0.8, 20, 2, 4, 6, 0.35, 3, true, 0.5));
		});
	}
}
