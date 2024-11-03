// Imports
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Variables
const AnimationList = new Set<string>([EAnimations.Block]);

CharacterManager.AddedCharacter.Connect((character) => {
	const Butler = character.Butler;
	const Attributes = character.Attributes;
	const Humanoid = character.Humanoid;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	Butler.Connect(Animator.AnimationPlayed, (animationTrack: AnimationTrack) => {
		if (!AnimationList.has(Tools.IdToName(animationTrack.Animation!.AnimationId))) return;
		Attributes.SetIsBlocking(true);
		Attributes.SetTickParry(tick());
		Butler.Once(animationTrack.Stopped, () => Attributes.SetIsBlocking(false));
	});
});
