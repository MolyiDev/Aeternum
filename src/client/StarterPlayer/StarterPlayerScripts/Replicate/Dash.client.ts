// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { AnimManager } from "shared/Managers/AnimManager";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Variables
const AnimationList = new Set<string>([
	EAnimations.DashForward,
	EAnimations.DashBack,
	EAnimations.DashLeft,
	EAnimations.DashRight,
]);

AnimManager.AnimationPlayOnce.Connect((character, animName, animTrack) => {
	if (!AnimationList.has(animName)) return;

	const Butler = character.Butler;
	const Model = character.Model;
	const Highlight = Model.Highlight;

	Butler.Once(animTrack.GetMarkerReachedSignal("DashStart"), () => {
		Highlight.FillColor = Color3.fromRGB(255, 255, 255);

		Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
			FillTransparency: 0.65,
		});
	});

	Butler.Once(animTrack.GetMarkerReachedSignal("End"), () => {
		Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
			FillTransparency: 1,
		});
	});
});
