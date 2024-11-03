// Imports
import { ReplicatedStorage, SoundService, Workspace } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { Butler } from "ReplicatedStorage/Modules/Butler";

// Variables
const TemporalFolder = Workspace.WaitForChild("Temporal");
const FootprintMaterials = new Set<Enum.Material>([Enum.Material.Sand, Enum.Material.Snow, Enum.Material.Mud]);

const FootstepsGroup = SoundService.WaitForChild("Footsteps") as SoundGroup;
const Footprint = ReplicatedStorage.WaitForChild("Effects").WaitForChild("Footprint") as BasePart;
const LoadedSFX = ReplicatedStorage.WaitForChild("Sounds").WaitForChild("Footsteps") as unknown as {
	[key: string]: Folder;
};

const FADE_OUT = new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 4);
const MIN_PITCH = 0.92;
const MAX_PITCH = 1.08;
const MIN_TREMOLO = 0.65;
const MAX_TREMOLO = 0.95;
const MIN_SPEED = 0.94;
const MAX_SPEED = 1.06;

export class Footsteps implements IReplicateClass {
	public Butler: Butler;
	public Humanoid: Humanoid;
	public SFXOrigin: Attachment;
	public LeftFootAttachment: Attachment;
	public RightFootAttachment: Attachment;
	public RayParams: RaycastParams;
	public OnceConnections: Set<RBXScriptConnection>;
	public FootstepConnection: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Butler = character.Butler;
		this.Humanoid = character.Humanoid;
		const Model = character.Model;

		const SFXOrigin = new Instance("Attachment");
		SFXOrigin.CFrame = new CFrame(0, -2.875, 0);
		SFXOrigin.Parent = character.HumanoidRootPart;
		this.SFXOrigin = SFXOrigin;

		const LeftFootAttachment = new Instance("Attachment");
		LeftFootAttachment.CFrame = new CFrame(0, -0.075, 0);
		LeftFootAttachment.Parent = Model.LeftFoot;
		this.LeftFootAttachment = LeftFootAttachment;

		const RightFootAttachment = new Instance("Attachment");
		RightFootAttachment.CFrame = new CFrame(0, -0.075, 0);
		RightFootAttachment.Parent = Model.RightFoot;
		this.RightFootAttachment = RightFootAttachment;

		const RayParams = new RaycastParams();
		RayParams.FilterType = Enum.RaycastFilterType.Exclude;
		RayParams.FilterDescendantsInstances = [Model];
		RayParams.IgnoreWater = true;
		this.RayParams = RayParams;

		this.OnceConnections = new Set();
	}

	public Destroy() {
		this.Butler.RemoveList(this.OnceConnections);
		this.Butler.Remove(this.FootstepConnection);

		this.Butler = undefined!;
		this.Humanoid = undefined!;
		this.SFXOrigin = undefined!;
		this.LeftFootAttachment = undefined!;
		this.RightFootAttachment = undefined!;
		this.RayParams = undefined!;
		this.FootstepConnection = undefined!;
		this.OnceConnections = undefined!;
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Butler = this.Butler;
		const Humanoid = this.Humanoid;

		this.FootstepConnection = Butler.Connect(animTrack.GetMarkerReachedSignal("Footstep"), (FootEnum?: string) => {
			const MaterialName = Humanoid.FloorMaterial.Name;
			if (!LoadedSFX[MaterialName]) return;

			const Sounds = LoadedSFX[MaterialName].GetChildren() as Sound[];
			const SelectedSound = Sounds[math.random(0, Sounds.size() - 1)] as Sound;
			const PlayingSound = SelectedSound.Clone();
			PlayingSound.Parent = this.SFXOrigin;

			PlayingSound.SoundGroup = FootstepsGroup;

			const randomSpeed = math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
			const roundedSpeed = math.round(randomSpeed * 1000) / 1000;

			PlayingSound.PlaybackSpeed = roundedSpeed;

			const pitchSound = new Instance("PitchShiftSoundEffect", PlayingSound);
			const randomPitch = math.random() * (MAX_PITCH - MIN_PITCH) + MIN_PITCH;
			const roundedPitch = math.round(randomPitch * 1000) / 1000;

			pitchSound.Octave = roundedPitch;

			const tremoloSound = new Instance("TremoloSoundEffect", PlayingSound);
			const randomTremolo = math.random() * (MAX_TREMOLO - MIN_TREMOLO) + MIN_TREMOLO;
			const roundedTremolo = math.round(randomTremolo * 1000) / 1000;

			tremoloSound.Depth = roundedTremolo;

			PlayingSound.Destroy();

			if (!FootprintMaterials.has(Humanoid.FloorMaterial)) return;

			const FootPrintOrigin =
				FootEnum === "0" ? this.LeftFootAttachment.WorldPosition : this.RightFootAttachment.WorldPosition;
			const FootPrintResult = Workspace.Raycast(FootPrintOrigin, new Vector3(0, -100, 0), this.RayParams);

			if (!FootPrintResult) return;

			const FootprintClone = Footprint.Clone();
			FootprintClone.Parent = TemporalFolder;
			const NewCFrame = CFrame.lookAt(
				FootPrintResult.Position,
				FootPrintResult.Position.add(FootPrintResult.Normal),
			).mul(CFrame.Angles(math.rad(-90), 0, 0));

			FootprintClone.CFrame = NewCFrame;
			const ShadowDecal = FootprintClone.FindFirstChild("Decal") as Decal;
			FootprintClone.Color = FootPrintResult.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(FootPrintResult.Material)
				: FootPrintResult.Instance.Color;
			FootprintClone.Material = FootPrintResult.Material;

			const ModelFadeOut = Tools.TweenPlay(FootprintClone, FADE_OUT, { Transparency: 1 });
			Tools.TweenPlay(ShadowDecal, FADE_OUT, { Transparency: 1 });

			const FadeOut = Butler.Once(ModelFadeOut.Completed, () => {
				FootprintClone.Destroy();
				this.OnceConnections.delete(FadeOut);
			});

			this.OnceConnections.add(FadeOut);
		});
	}
}
