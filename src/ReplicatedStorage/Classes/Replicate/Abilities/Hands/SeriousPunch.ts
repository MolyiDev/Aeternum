// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { SeriousPunchInfo } from "ReplicatedStorage/Abilities/Hands/SeriousPunch";
import { ReplicatedStorage } from "@rbxts/services";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

// Interfaces
interface IVFXParticleEmitter extends Attachment {
	ParticleEmitter: ParticleEmitter;
}

interface IVFXBeams extends BasePart {
	LeftBeam: Beam;
	LeftBegin: Attachment;
	LeftFinal: Attachment;
	RightBeam: Beam;
	RightBegin: Attachment;
	RightFinal: Attachment;
}

// Variables
const VFXFolder = ReplicatedStorage.WaitForChild("VFX").WaitForChild("Abilities").WaitForChild("SeriousPunch");
const VFXFist = VFXFolder.WaitForChild("Fist").WaitForChild("Attachment") as IVFXParticleEmitter;
const VFXFootstep = VFXFolder.WaitForChild("Footstep").WaitForChild("Attachment") as IVFXParticleEmitter;
const VFXSeriousPunch = VFXFolder.WaitForChild("SeriousPunch") as IVFXBeams;
const TweenI = new TweenInfo(2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

const NumberSequenceIn = new NumberSequence([
	new NumberSequenceKeypoint(0, 1),
	new NumberSequenceKeypoint(0.07, 1),
	new NumberSequenceKeypoint(0.5, 0),
	new NumberSequenceKeypoint(0.93, 1),
	new NumberSequenceKeypoint(1, 1),
]);

const NumberSequenceOut = new NumberSequence([
	new NumberSequenceKeypoint(0, 1),
	new NumberSequenceKeypoint(0.07, 1),
	new NumberSequenceKeypoint(0.5, 1),
	new NumberSequenceKeypoint(0.93, 1),
	new NumberSequenceKeypoint(1, 1),
]);

const ParticleMap = new Map<string, number>([
	["AirCone", 300],
	["Smoke", 250],
]);

@ReplicateInfo(SeriousPunchInfo)
export class SeriousPunch implements IReplicateClass {
	public Character: Character;
	public SelfMarkerRock: RBXScriptConnection = undefined!;
	public SelfMarkerRockLast: RBXScriptConnection = undefined!;
	public MarkerLegImpact: RBXScriptConnection = undefined!;
	public MarkerFistImpact: RBXScriptConnection = undefined!;

	public VFXFistClone: IVFXParticleEmitter;
	public VFXFootstepClone: IVFXParticleEmitter;
	public VFXSeriousPunchClone: IVFXBeams;

	constructor(character: Character) {
		this.Character = character;
		const Model = character.Model;

		this.VFXFistClone = VFXFist.Clone();
		this.VFXFistClone.Parent = Model.RightHand;

		this.VFXFootstepClone = VFXFootstep.Clone();
		this.VFXFootstepClone.Parent = Model.RightFoot;

		const VFXSeriousPunchClone = VFXSeriousPunch.Clone();
		VFXSeriousPunchClone.Parent = Model;

		VFXSeriousPunchClone.LeftBeam.Attachment0 = VFXSeriousPunchClone.LeftBegin;
		VFXSeriousPunchClone.LeftBeam.Attachment1 = VFXSeriousPunchClone.LeftFinal;

		VFXSeriousPunchClone.RightBeam.Attachment0 = VFXSeriousPunchClone.RightBegin;
		VFXSeriousPunchClone.RightBeam.Attachment1 = VFXSeriousPunchClone.RightFinal;

		this.VFXSeriousPunchClone = VFXSeriousPunchClone;
	}

	Destroy() {
		this.Character.Butler.RemoveList(this.MarkerLegImpact, this.MarkerFistImpact);

		this.Character = undefined!;
		this.MarkerLegImpact = undefined!;
		this.MarkerFistImpact = undefined!;
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Tweens = Character.Tweens;
		const Butler = Character.Butler;

		this.SelfMarkerRock = Butler.Connect(animTrack.GetMarkerReachedSignal("LegImpact"), () => {
			if (!Attributes.UsingAbility()) return;

			Tweens.GetCameraShaker().ShakeOnce(3, 8, 0, 0.6);
			Tweens.SetCameraFov(120, 0.85);
		});

		this.SelfMarkerRockLast = Butler.Connect(animTrack.GetMarkerReachedSignal("FistImpact"), () => {
			Tweens.SetCameraFov(ECameraFovs.Default, 0.25);

			if (!Attributes.UsingAbility()) return;

			Tweens.GetCameraShaker().ShakeOnce(6, 12, 0, 1.2);
		});
	}

	public SelfAnimStop(animTrack: AnimationTrack, animName: string): void {
		this.Character.Tweens.SetCameraFov(ECameraFovs.Default, 0.1);
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Model = Character.Model;
		const Butler = Character.Butler;

		this.MarkerLegImpact = Butler.Connect(animTrack.GetMarkerReachedSignal("LegImpact"), () => {
			const CF = Model.RightFoot.CFrame;

			this.VFXFootstepClone.ParticleEmitter.Emit(150);

			RockManager.Crater(CF, 0, 0.35, 1, 5, 1, 0.05);
			RockManager.Explosion(CF.Position, 0.35, 1, 2, 10);
		});

		this.MarkerFistImpact = Butler.Connect(animTrack.GetMarkerReachedSignal("FistImpact"), () => {
			const CF = Character.HumanoidRootPart.CFrame;

			if (!Attributes.UsingAbility()) {
				animTrack.Stop(EStopGlobal);
				RockManager.Crater(CF, 0, 0.6, 3, 8, 1, 0.25);
				return;
			}

			//#region VFX Punch

			this.VFXFistClone.ParticleEmitter.Enabled = false;

			this.VFXSeriousPunchClone.LeftBeam.Transparency = NumberSequenceIn;
			this.VFXSeriousPunchClone.RightBeam.Transparency = NumberSequenceIn;

			this.VFXSeriousPunchClone.CFrame = CF.add(CF.LookVector.mul(3));

			Tools.TweenTransparency(this.VFXSeriousPunchClone.LeftBeam, TweenI, NumberSequenceOut);
			Tools.TweenTransparency(this.VFXSeriousPunchClone.RightBeam, TweenI, NumberSequenceOut);

			for (const Particle of this.VFXSeriousPunchClone.GetDescendants()) {
				if (!Particle.IsA("ParticleEmitter")) continue;

				const number = ParticleMap.get(Particle.Name);
				if (number) Particle.Emit(number);
				else Particle.Emit(1);
			}

			//#endregion

			RockManager.Crater(CF, 6, 0.75, 4, 8, 2, 0.25);
			RockManager.Explosion(CF.Position, 0.45, 1, 3, 30);
			delay(0.05, () => RockManager.Crater(CF, 6, 0.45, 8, 20, 2, 0.25));
			RockManager.Trail(
				Character.HumanoidRootPart.CFrame,
				20,
				70,
				4.5,
				Vector3.one,
				18,
				12,
				0.4,
				4,
				true,
				8,
				3,
				0.02,
			);
		});
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.VFXFistClone.ParticleEmitter.Enabled = true;
	}
}
