import { Character } from "shared/Classes/Character";
import { EAnimations } from "shared/Enums/EAnimations";
import { AnimManager } from "shared/Managers/AnimManager";
import { CharacterManager } from "shared/Managers/CharacterManager";
import { ElectricKick } from "./Abilities/ElectricKick";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";
import { EAbility } from "shared/Enums/Abilities/EAbility";

interface IReplicateInfo {
	Ability: boolean;
	Cooldown: number;
	AddedCharacter?: Callback;
	RemovedCharacter?: Callback;
	AnimPlayOnce?: Callback;
	AnimPlay?: Callback;
	AnimStop?: Callback;
}

const Replicates = new Map<string, IReplicateInfo>([
	[
		EAnimations.ElectricKick,
		{
			Ability: true,
			Cooldown: EAbilityInfo[EAbility.ElectricKick].Cooldown,
			AddedCharacter: undefined,
			RemovedCharacter: undefined,
			AnimPlayOnce: (character, animTrack) => ElectricKick.AnimPlay(character, animTrack),
			AnimPlay: undefined,
			AnimStop: undefined,
		},
	],
]);

const ReplicatesAdded = new Set<Callback>();
const ReplicatesRemoved = new Set<Callback>();

Replicates.forEach((replicatedInfo) => {
	if (replicatedInfo.AddedCharacter) ReplicatesAdded.add(replicatedInfo.AddedCharacter);
	if (replicatedInfo.RemovedCharacter) ReplicatesRemoved.add(replicatedInfo.RemovedCharacter);
});

CharacterManager.AddedCharacter.Connect((character: Character) => {
	const PlayedAnimations = new Set<string>();
	const ReplicatesPlaying = new Map<string, IReplicateInfo>();
	const Attributes = character.Attributes;
	const Abilities = character.Abilities;
	const Animator = character.Humanoid.Animator;
	const Butler = character.Butler;

	task.spawn(() => ReplicatesAdded.forEach((callBack) => callBack(character)));

	Butler.Connect(Animator.AnimationPlayed, (animTrack) => {
		const AnimName = AnimManager.IdToName(animTrack.Animation!.AnimationId);
		const Replicate = Replicates.get(AnimName);
		if (!Replicate) return;

		if (Replicate.Ability && !Abilities.Has(AnimName)) {
			animTrack.Stop();
			return;
		}

		if (Replicate.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(AnimName);
			if (time < Replicate.Cooldown) {
				animTrack.Stop();
				return;
			}
			Attributes.SetTickAnim(AnimName, Replicate.Cooldown);
		}

		if (!PlayedAnimations.has(AnimName)) {
			PlayedAnimations.add(AnimName);
			if (Replicate.AnimPlayOnce) Replicate.AnimPlayOnce(character);
			if (Replicate.AnimStop)
				Butler.Connect(animTrack.Stopped, () => {
					Replicate.AnimStop!(character);
					ReplicatesPlaying.delete(AnimName);
				});
			else Butler.Connect(animTrack.Stopped, () => ReplicatesPlaying.delete(AnimName));
		}

		if (Replicate.AnimPlayOnce && !PlayedAnimations.has(AnimName)) {
			PlayedAnimations.add(AnimName);
			Replicate.AnimPlayOnce(character);
		}

		ReplicatesPlaying.set(AnimName, Replicate);
		if (Replicate.AnimPlay) Replicate.AnimPlay(character);
	});
});

CharacterManager.RemovedCharacter.Connect((character) =>
	task.spawn(() => ReplicatesRemoved.forEach((callBack) => callBack(character))),
);
