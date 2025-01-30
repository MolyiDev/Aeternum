// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
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
			const CF = this.Model.RightFoot.CFrame;

			//RockManager.Crater(CF, 0, 0.35, 1, 5, 1, 0.05);
			RockLibrary.Explosion(CF.Position, 0.4, 45, 15, 3);
		});

		this.MarkFistImpact = this.Butler.Connect(animTrack.GetMarkerReachedSignal("FistImpact"), () => {
			const CF = this.HumanoidRootPart.CFrame;

			if (!this.Attributes.UsingAbility()) {
				animTrack.Stop(EGlobal.Feint);
				RockManager.Crater(CF, 0, 0.6, 3, 8, 1, 0.25);
				return;
			}

			//#region VFX Punch

			this.VFXImpactClone.CFrame = this.HumanoidRootPart.CFrame.add(
				this.HumanoidRootPart.CFrame.LookVector.mul(2.5),
			);
			Tools.EmitParticles(this.VFXImpactClone.GetDescendants());

			//#endregion

			//RockManager.Crater(CF, 6, 0.75, 4, 8, 2, 0.25, true, 0.5);

			RockLibrary.Explosion(CF.Position, 0.5, 45, 35, 3);
			RockLibrary.Line(CF, 28, -4.25, 2, 70, 1, 12, 30, 0, 3, 0.285, 2.75, 0.012);
		});
	}
}
