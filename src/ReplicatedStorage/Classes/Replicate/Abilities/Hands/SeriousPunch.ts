// Imports
import { Character } from "ReplicatedStorage/Classes/Character";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { SeriousPunchInfo } from "ReplicatedStorage/Abilities/Hands/SeriousPunch";
import { ReplicatedStorage } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EBlur } from "ReplicatedStorage/Enums/EBlur";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import RockLibrary from "ReplicatedStorage/Libraries/RockLibrary";

// Variables
const VFXFolder = ReplicatedStorage.WaitForChild("VFX").WaitForChild("Abilities").WaitForChild("SeriousPunch");
const VFXImpact = VFXFolder.WaitForChild("Impact") as BasePart;

@ReplicateInfo(SeriousPunchInfo)
export class SeriousPunch extends CReplicate {
	public SelfMarkLegImpact: RBXScriptConnection = undefined!;
	public SelfMarkFistImpact: RBXScriptConnection = undefined!;
	public MarkLegImpact: RBXScriptConnection = undefined!;
	public MarkFistImpact: RBXScriptConnection = undefined!;

	public VFXImpactClone: BasePart;

	constructor(character: Character) {
		super(character);

		this.VFXImpactClone = VFXImpact.Clone();
		this.VFXImpactClone.Parent = this.HumanoidRootPart;
	}

	Destroy() {
		this.Butler.RemoveList(
			this.SelfMarkLegImpact,
			this.SelfMarkFistImpact,
			this.MarkLegImpact,
			this.MarkFistImpact,
		);
		this.VFXImpactClone.Destroy();

		this.SelfMarkLegImpact = undefined!;
		this.SelfMarkFistImpact = undefined!;
		this.MarkLegImpact = undefined!;
		this.MarkFistImpact = undefined!;
		this.VFXImpactClone = undefined!;

		super.Destroy();
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack) {
		this.SelfMarkLegImpact = this.Butler.Connect(animTrack.GetMarkerReachedSignal("LegImpact"), () => {
			if (!this.Attributes.UsingAbility()) return;

			this.Tweens.GetCameraShaker().ShakeOnce(4, 8, 0, 0.8);
			this.Tweens.SetCameraFov(120, 0.85);
			this.Tweens.SetBlur(7, 0.85);
		});

		this.SelfMarkFistImpact = this.Butler.Connect(animTrack.GetMarkerReachedSignal("FistImpact"), () => {
			this.Tweens.SetCameraFov(ECameraFovs.Default, 0.25);
			this.Tweens.SetBlur(EBlur.Default, 0.25);

			if (!this.Attributes.UsingAbility()) return;

			this.Tweens.GetCameraShaker().ShakeOnce(6, 12, 0, 1.2);
		});
	}

	public SelfAnimStop(animTrack: AnimationTrack, animName: string): void {
		this.Tweens.SetCameraFov(ECameraFovs.Default, 0.1);
		this.Tweens.SetBlur(EBlur.Default, 0.1);
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		this.MarkLegImpact = this.Butler.Connect(animTrack.GetMarkerReachedSignal("LegImpact"), () => {
			if (!this.CanReplicate()) return;
			const CF = this.Model.RightFoot.CFrame;

			RockLibrary.Crater(CF, 1, 0.35, 5, 1, 2, 0, 0.1, 3, false);
			RockLibrary.Explosion(CF.Position, 0.4, 45, 15, 3);
		});

		this.MarkFistImpact = this.Butler.Connect(animTrack.GetMarkerReachedSignal("FistImpact"), () => {
			if (!this.CanReplicate()) return;
			const CF = this.HumanoidRootPart.CFrame;

			if (!this.Attributes.UsingAbility()) {
				animTrack.Stop(EGlobal.Feint);
				RockLibrary.Crater(CF, 3, 0.55, 8, 1, 2, 0, 0.3, 3.5, false);
				return;
			}

			//#region VFX Punch

			this.VFXImpactClone.CFrame = this.HumanoidRootPart.CFrame.add(
				this.HumanoidRootPart.CFrame.LookVector.mul(2.5),
			);
			Tools.EmitParticles(this.VFXImpactClone.GetDescendants());

			//#endregion

			RockLibrary.Crater(CF, 4, 0.75, 8, 2, 4, 6, 0.3, 3.5, true, 0.5);
			RockLibrary.Explosion(CF.Position, 0.5, 45, 35, 4);
			RockLibrary.Line(CF, 45, -4.25, 2, 70, 1, 12, 30, 4, 0.285, 2.75, 0.012);
		});
	}
}
