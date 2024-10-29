// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const AnimationList = new Set<string>([
	EAnimations.DashForward,
	EAnimations.DashBack,
	EAnimations.DashLeft,
	EAnimations.DashRight,
]);

AnimManager.AnimationPlayed.Connect((character, animName, animTrack) => {
	if (!AnimationList.has(animName)) return;
	const Highlight = character.Highlight;

	janitor.Add(
		animTrack.GetMarkerReachedSignal("DashStart").Once(() => {
			Highlight.FillColor = Color3.fromRGB(255, 255, 255);

			Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
				FillTransparency: 0.65,
			});
		}),
	);

	janitor.Add(
		animTrack.GetMarkerReachedSignal("End").Once(() => {
			Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
				FillTransparency: 1,
			});
		}),
	);
});
