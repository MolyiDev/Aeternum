// Imports
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { AnimManager } from "ReplicatedStorage/Managers/AnimManager";

// Variables
const AnimationList = new Set<string>([
	EAnimations.DashForward,
	EAnimations.DashBack,
	EAnimations.DashLeft,
	EAnimations.DashRight,
]);

AnimManager.AnimationPlayOnce.Connect((character, animName, animTrack) => {
	if (!AnimationList.has(animName)) return;
	const Attributes = character.Attributes;
	const Butler = character.Butler;

	Butler.Connect(animTrack.GetMarkerReachedSignal("DashStart"), () => {
		Attributes.SetIsDashing(true);
	});

	Butler.Connect(animTrack.GetMarkerReachedSignal("DashEnd"), () => {
		Attributes.SetIsDashing(false);
	});
});
