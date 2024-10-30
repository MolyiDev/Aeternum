// Imports
import { Workspace } from "@rbxts/services";
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const AnimationList = new Set<string>([
	EAnimations.WalkForward,
	EAnimations.WalkBack,
	EAnimations.WalkLeft,
	EAnimations.WalkRight,
	EAnimations.Run,
]);

const TemporalFolder = Workspace.WaitForChild("Temporal");
const FootprintMaterials = new Set<Enum.Material>([Enum.Material.Sand, Enum.Material.Snow, Enum.Material.Mud]);

const FootstepsGroup = script.WaitForChild("Footsteps") as SoundGroup;
const Footprint = script.WaitForChild("Footprint") as BasePart;
const SFX = script.WaitForChild("SFX") as Folder;

const LoadedSFX: { [key: string]: Sound[] } = {};

SFX.GetChildren().forEach((folder) => (LoadedSFX[folder.Name] = folder.GetChildren() as Sound[]));

const FADE_OUT = new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 4);
const MIN_PITCH = 0.92;
const MAX_PITCH = 1.08;
const MIN_TREMOLO = 0.65;
const MAX_TREMOLO = 0.95;
const MIN_SPEED = 0.94;
const MAX_SPEED = 1.06;

CharacterManager.AddedCharacter.Connect((character) => {
	const Animations = character.Animations;
	const Humanoid = character.Humanoid;
	const Butler = character.Butler;
	const Model = character.Model;

	const SFXOrigin = new Instance("Attachment");
	SFXOrigin.CFrame = new CFrame(0, -2.875, 0);
	SFXOrigin.Parent = character.HumanoidRootPart;

	const LeftFootAttachment = new Instance("Attachment");
	LeftFootAttachment.CFrame = new CFrame(0, -0.075, 0);
	LeftFootAttachment.Parent = Model.WaitForChild("LeftFoot");

	const RightFootAttachment = new Instance("Attachment");
	RightFootAttachment.CFrame = new CFrame(0, -0.075, 0);
	RightFootAttachment.Parent = Model.WaitForChild("RightFoot");

	const RayParams = new RaycastParams();
	RayParams.FilterType = Enum.RaycastFilterType.Exclude;
	RayParams.FilterDescendantsInstances = [Model];
	RayParams.IgnoreWater = true;

	Animations.AnimationPlayOnce.Connect((animName, animTrack) => {
		if (!AnimationList.has(animName)) return;

		Butler.Connect(animTrack.GetMarkerReachedSignal("Footstep"), (FootEnum?: string) => {
			const MaterialName = Humanoid.FloorMaterial.Name;
			if (!LoadedSFX[MaterialName]) return;

			const SelectedSound = LoadedSFX[MaterialName][math.random(0, LoadedSFX[MaterialName].size() - 1)];
			const PlayingSound = SelectedSound.Clone();
			PlayingSound.Parent = SFXOrigin;

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
				FootEnum === "0" ? LeftFootAttachment.WorldPosition : RightFootAttachment.WorldPosition;
			const FootPrintResult = Workspace.Raycast(FootPrintOrigin, new Vector3(0, -100, 0), RayParams);

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

			Butler.Once(ModelFadeOut.Completed, () => FootprintClone.Destroy());
		});
	});
});
