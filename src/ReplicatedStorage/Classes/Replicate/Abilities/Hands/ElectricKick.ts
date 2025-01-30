// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { ElectricKickInfo } from "ReplicatedStorage/Abilities/Hands/ElectricKick";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

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
			const CF = this.Model.RightHand.CFrame;
			RockManager.Crater(CF, 0, 0.35, 2, 6, 1, 0.1);

			if (!this.Attributes.UsingAbility()) {
				animTrack.Stop(EGlobal.Feint);
				return;
			}

			RockManager.Explosion(CF.Position, 0.35, 1, 2, 20);

			RockManager.Trail(this.HumanoidRootPart.CFrame, 10, 20, 1, Vector3.one, 2, 8, 0.4, 4, false, 8, 3, 0.01);
		});

		this.MarkRockDown = this.Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () => {
			const CF = this.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.45, 1, 3, 30);
			RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25, true, 0.5);
			task.delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25, true, 0.5));
		});
	}
}
