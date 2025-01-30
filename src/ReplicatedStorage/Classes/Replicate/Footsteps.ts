// Imports
import { ReplicatedStorage, SoundService, Workspace } from "@rbxts/services";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CReplicate } from "../Abstracts/CReplicate";
import { Default_Hands_WalkInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Walk";
import { Default_Hands_RunInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Run";

// Variables
const TemporalFolder = Workspace.WaitForChild("Temporal");
const NotFootprintMaterials = new Set<Enum.Material>([]);

const EffectsGroup = SoundService.WaitForChild("Effects") as SoundGroup;
const Footprint = ReplicatedStorage.WaitForChild("Effects").WaitForChild("Footprint") as BasePart;
const LoadedSFX = ReplicatedStorage.WaitForChild("Sounds").WaitForChild("Footsteps") as unknown as {
	[key: string]: Folder;
};

const FADE_OUT = new TweenInfo(1, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, 0, false, 1);
const MIN_TREMOLO = 0.65;
const MAX_TREMOLO = 0.95;
const MIN_SPEED = 0.94;
const MAX_SPEED = 1.06;

@ReplicateInfo(Default_Hands_WalkInfo, Default_Hands_RunInfo)
export class Footsteps extends CReplicate {
	public SFXOrigin: Attachment;
	public LeftFootAttachment: Attachment;
	public RightFootAttachment: Attachment;
	public RayParams: RaycastParams = new RaycastParams();
	public FootstepConnection: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		super(character);

		const SFXOrigin = new Instance("Attachment", this.HumanoidRootPart);
		SFXOrigin.CFrame = new CFrame(0, -2.875, 0);
		this.SFXOrigin = SFXOrigin;

		this.LeftFootAttachment = new Instance("Attachment", this.Model.LeftFoot);
		this.RightFootAttachment = new Instance("Attachment", this.Model.RightFoot);

		this.RayParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.RayParams.AddToFilter(this.Model);
	}

	public Destroy() {
		this.Butler.Remove(this.FootstepConnection);
		this.SFXOrigin.Destroy();
		this.LeftFootAttachment.Destroy();
		this.RightFootAttachment.Destroy();

		this.SFXOrigin = undefined!;
		this.LeftFootAttachment = undefined!;
		this.RightFootAttachment = undefined!;
		this.RayParams = undefined!;
		this.FootstepConnection = undefined!;

		super.Destroy();
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		this.FootstepConnection = this.Butler.Connect(
			animTrack.GetMarkerReachedSignal("Footstep"),
			(FootEnum?: string) => {
				const MaterialName = this.Humanoid.FloorMaterial.Name;
				if (MaterialName === "Air") return;

				const Sounds = LoadedSFX[MaterialName].GetChildren() as Sound[];
				const SelectedSound = Sounds[math.random(0, Sounds.size() - 1)] as Sound;
				const PlayingSound = SelectedSound.Clone();
				PlayingSound.Parent = this.SFXOrigin;

				PlayingSound.SoundGroup = EffectsGroup;

				const randomSpeed = math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
				const roundedSpeed = math.round(randomSpeed * 1000) / 1000;

				PlayingSound.PlaybackSpeed = roundedSpeed;

				const tremoloSound = new Instance("TremoloSoundEffect", PlayingSound);
				const randomTremolo = math.random() * (MAX_TREMOLO - MIN_TREMOLO) + MIN_TREMOLO;
				const roundedTremolo = math.round(randomTremolo * 1000) / 1000;

				tremoloSound.Depth = roundedTremolo;

				PlayingSound.Destroy();

				if (NotFootprintMaterials.has(this.Humanoid.FloorMaterial)) return;

				const FootAttachment = FootEnum === "Left" ? this.LeftFootAttachment : this.RightFootAttachment;
				const FootPrintOrigin = FootAttachment.WorldPosition;
				const FootPrintResult = Workspace.Raycast(FootPrintOrigin, new Vector3(0, -2.5, 0), this.RayParams);

				if (!FootPrintResult) return;

				const FootprintClone = Footprint.Clone();
				FootprintClone.Parent = TemporalFolder;

				const [X, Y, Z] = (
					FootEnum === "Left" ? this.Model.LeftFoot : this.Model.RightFoot
				).CFrame.ToOrientation();
				const NewCFrame = CFrame.fromOrientation(0, Y, 0).add(FootPrintResult.Position);

				FootprintClone.CFrame = NewCFrame;
				const ShadowDecal = FootprintClone.FindFirstChild("ShadowDecal") as Decal;
				const BreakDecal = FootprintClone.FindFirstChild("BreakDecal") as Decal;
				FootprintClone.Color = FootPrintResult.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(FootPrintResult.Material)
					: FootPrintResult.Instance.Color;
				FootprintClone.Material = FootPrintResult.Material;

				const ModelFadeOut = Tools.TweenPlay(FootprintClone, FADE_OUT, { Transparency: 1 });
				Tools.TweenPlay(ShadowDecal, FADE_OUT, { Transparency: 1 });
				Tools.TweenPlay(BreakDecal, FADE_OUT, { Transparency: 1 });

				ModelFadeOut.Completed.Once(() => FootprintClone.Destroy());
			},
		);
	}
}
