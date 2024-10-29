// Imports
import { EAnimations } from "shared/Enums/EAnimations";
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
	const Attributes = character.Attributes;
	const Janitor = character.Janitor;

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("DashStart").Connect(() => {
			Attributes.SetIsDashing(true);
		}),
	);

	Janitor.Add(
		animTrack.GetMarkerReachedSignal("DashEnd").Connect(() => {
			Attributes.SetIsDashing(false);
		}),
	);
});
