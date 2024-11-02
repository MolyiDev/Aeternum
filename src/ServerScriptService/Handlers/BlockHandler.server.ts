// Imports
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { AnimManager } from "ReplicatedStorage/Managers/AnimManager";

// Variables
const AnimationList = new Set<string>([EAnimations.Block]);

CharacterManager.AddedCharacter.Connect((character) => {
	const Butler = character.Butler;
	const Attributes = character.Attributes;
	const Humanoid = character.Humanoid;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	Butler.Connect(Animator.AnimationPlayed, (animationTrack: AnimationTrack) => {
		if (!AnimationList.has(AnimManager.IdToName(animationTrack.Animation!.AnimationId))) return;
		Attributes.SetIsBlocking(true);
		Attributes.SetTickParry(tick());
		Butler.Once(animationTrack.Stopped, () => Attributes.SetIsBlocking(false));
	});
});
