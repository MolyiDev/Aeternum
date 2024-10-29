// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { IModel } from "shared/Interfaces/IModel";
import { Janitor } from "@rbxts/janitor";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { EAttribute } from "shared/Enums/EAttribute";
import { AttributeManager } from "shared/Managers/AttributeManager";

// Variables
const AnimationList = new Set<string>([EAnimations.Block]);

CharacterManager.AddedCharacter.Connect((character: IModel, janitor: Janitor) => {
	const Humanoid = character.WaitForChild("Humanoid") as Humanoid;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	janitor.Add(
		Animator.AnimationPlayed.Connect((animationTrack: AnimationTrack) => {
			if (!AnimationList.has(Tools.IdAnimToName(animationTrack.Animation!.AnimationId))) return;
			AttributeManager.SetIsBlocking(character, true);
			AttributeManager.SetTickParry(character, tick());
			janitor.Add(animationTrack.Stopped.Once(() => AttributeManager.SetIsBlocking(character, false)));
		}),
	);
});
