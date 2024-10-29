// Imports
import Signal from "@rbxts/lemon-signal";
import { Character } from "shared/Classes/Character";
import { Tools } from "shared/Libraries/Tools";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Events
const AnimationPlayedSignal = new Signal<[character: Character, animName: string, animTrack: AnimationTrack]>();

// Variables

CharacterManager.AddedCharacter.Connect((character) => {
	const PlayerAnimations = new Set<string>();
	const Janitor = character.Janitor;
	const Animator = character.Humanoid.Animator;

	Janitor.Add(
		Animator.AnimationPlayed.Connect((animTrack) => {
			const AnimName = Tools.IdAnimToName(animTrack.Animation!.AnimationId);
			if (PlayerAnimations.has(AnimName)) return;
			PlayerAnimations.add(AnimName);
			character.Animations.AnimationPlayed.Fire(AnimName, animTrack);
			AnimationPlayedSignal.Fire(character, AnimName, animTrack);
		}),
	);
});

export class AnimManager {
	public static AnimationPlayed = AnimationPlayedSignal;
}
