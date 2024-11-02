import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EAbilityPlace } from "ReplicatedStorage/Enums/Abilities/EAbilityPlace";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EReplicateInfo } from "ReplicatedStorage/Enums/Replicate/EReplicateInfo";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { AnimManager } from "ReplicatedStorage/Managers/AnimManager";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EReplicateSound } from "ReplicatedStorage/Enums/Replicate/EReplicateSound";

export class ReplicateClient {
	public Character: Character;
	public ReplicateModules: Map<EAnimations | string, IReplicateClass>;
	public StopModules: Set<IReplicateClass>;
	public ReplicatesPlayed: Set<EAnimations | string>;
	public ReplicatesPlaying: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Animator = character.Humanoid.Animator;

		this.ReplicateModules = new Map();
		this.StopModules = new Set();
		this.ReplicatesPlayed = new Set();
		this.ReplicatesPlaying = new Set();

		Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
			this.AbilityAdded(abilityPlace, weapon, ability),
		);

		Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
			this.AbilityRemoved(abilityPlace, weapon, ability),
		);

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.AnimationPlayed(animTrack));

		task.spawn(() => this.InitializeDefaultModules());
	}

	public InitializeDefaultModules() {
		const classDash = new (EReplicateInfo.get(EAnimations.DashForward)!.Class)(this.Character);
		const classFootstep = new (EReplicateInfo.get(EAnimations.WalkForward)!.Class)(this.Character);

		this.StopModules.add(classDash);
		this.StopModules.add(classFootstep);

		this.ReplicateModules.set(EAnimations.DashForward, classDash);
		this.ReplicateModules.set(EAnimations.DashBack, classDash);
		this.ReplicateModules.set(EAnimations.DashLeft, classDash);
		this.ReplicateModules.set(EAnimations.DashRight, classDash);

		this.ReplicateModules.set(EAnimations.WalkForward, classFootstep);
		this.ReplicateModules.set(EAnimations.WalkBack, classFootstep);
		this.ReplicateModules.set(EAnimations.WalkLeft, classFootstep);
		this.ReplicateModules.set(EAnimations.WalkRight, classFootstep);
		this.ReplicateModules.set(EAnimations.Run, classFootstep);

		this.Character.Model.Abilities.GetAttributes().forEach((attributeValue, ability) => {
			const classByName = new (EReplicateInfo.get(ability)!.Class)(this.Character);
			this.ReplicateModules.set(ability, classByName);
			if ("Stop" in classByName) this.StopModules.add(classByName);
		});
	}

	public AbilityAdded(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const classByName = new (EReplicateInfo.get(ability)!.Class)(this.Character);
		this.ReplicateModules.set(ability, classByName);
		if ("Stop" in classByName) this.StopModules.add(classByName);
	}

	public AbilityRemoved(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		if ("Stop" in ReplicateClass) {
			this.StopModules.delete(ReplicateClass);
			ReplicateClass.Stop!();
		}

		this.ReplicateModules.delete(ability);
	}

	private ReadSoundString(soundString: string) {
		const parts = soundString.split(",");
		const SoundName = parts[0] ?? "";
		const Start = tonumber(parts[1]) ?? 0;
		const Volume = tonumber(parts[2]) ?? 1;
		const Speed = tonumber(parts[3]) ?? 1;

		return [SoundName, Start, Volume, Speed];
	}

	public AnimationPlayed(animTrack: AnimationTrack) {
		const AnimName = AnimManager.IdToName(animTrack.Animation!.AnimationId);
		const ReplicateClass = this.ReplicateModules.get(AnimName);
		if (!ReplicateClass) return;
		const ReplicateInfo = EReplicateInfo.get(AnimName)!;

		const Character = this.Character;
		const Butler = Character.Butler;
		const Abilities = Character.Abilities;
		const Attributes = Character.Attributes;

		if (
			ReplicateInfo.Ability &&
			(!Abilities.Has(AnimName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== AnimName) ||
				Attributes.UsingMove())
		) {
			animTrack.Stop();
			return;
		}

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(AnimName);
			if (time < ReplicateInfo.Cooldown) {
				animTrack.Stop();
				return;
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack);
			if ("AnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => {
					ReplicateClass.AnimStop!(animTrack);
					this.ReplicatesPlaying.delete(AnimName);
				});
			else Butler.Connect(animTrack.Stopped, () => this.ReplicatesPlaying.delete(AnimName));

			if (EReplicateSound.has(AnimName)) {
				Butler.Connect(animTrack.GetMarkerReachedSignal("Sound"), (soundString?: string) => {
					const [SoundName, Start, Volume, Speed] = this.ReadSoundString(soundString!);
					const Sound = Tools.SoundNameToSound(SoundName as string);
					const SoundClone = Sound.Clone();
					SoundClone.Parent = this.Character.HumanoidRootPart;
					SoundClone.TimePosition = Start as number;
					SoundClone.Volume = Volume as number;
					SoundClone.PlaybackSpeed = Speed as number;
					SoundClone.Destroy();
				});
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack);
		}

		this.ReplicatesPlaying.add(AnimName);
		ReplicateClass.AnimPlay?.(animTrack);
	}

	public Destroy() {
		this.ReplicateModules.clear();

		this.StopModules.forEach((replicateClass) => {
			replicateClass.Stop!();
			this.StopModules.delete(replicateClass);
		});

		this.ReplicatesPlayed.clear();
		this.ReplicatesPlaying.clear();
	}
}
