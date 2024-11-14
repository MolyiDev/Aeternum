/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EAbilityPlace } from "ReplicatedStorage/Enums/Abilities/EAbilityPlace";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

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
		const ClassDash = new (ModuleManager.GetReplicate("Dash"))(this.Character);
		const ClassFootsteps = new (ModuleManager.GetReplicate("Footsteps"))(this.Character);

		this.StopModules.add(ClassDash);
		this.StopModules.add(ClassFootsteps);

		this.ReplicateModules.set(EAnimations.DashForward, ClassDash);
		this.ReplicateModules.set(EAnimations.DashBack, ClassDash);
		this.ReplicateModules.set(EAnimations.DashLeft, ClassDash);
		this.ReplicateModules.set(EAnimations.DashRight, ClassDash);

		this.ReplicateModules.set(EAnimations.WalkForward, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkForwardLeft, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkForwardRight, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkBack, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkBackLeft, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkBackRight, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkLeft, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.WalkRight, ClassFootsteps);
		this.ReplicateModules.set(EAnimations.Run, ClassFootsteps);

		this.Character.Model.Abilities.GetAttributes().forEach((attributeValue, ability) => {
			this.AbilityAdded(
				undefined as unknown as EAbilityPlace,
				undefined as unknown as EWeapons,
				ability as EAbility,
			);
		});
	}

	public AbilityAdded(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		this.ReplicateModules.set(ability, classByName);
		if ("Destroy" in classByName) this.StopModules.add(classByName);
	}

	public AbilityRemoved(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		if (this.StopModules.delete(ReplicateClass)) ReplicateClass.Destroy!();

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
		const AnimName = Tools.IdToName(animTrack.Animation!.AnimationId);
		const ReplicateInfo = ModuleManager.GetReplicateInfo(AnimName);
		if (!ReplicateInfo) return;
		const ReplicateName = ReplicateInfo.Class ?? AnimName;
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const Character = this.Character;
		const Butler = Character.Butler;
		const Abilities = Character.Abilities;
		const Attributes = Character.Attributes;

		if (!ReplicateInfo.CanUseStunned && Attributes.IsStunnedFull()) {
			animTrack.Stop();
			return;
		}

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) {
				animTrack.Stop();
				return;
			}
		}

		if (ReplicateInfo.Ability) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingMove()
			) {
				animTrack.Stop();
				return;
			}

			if (ReplicateInfo.CanFeint) {
				this.Character.Abilities.AbilitiesFeint.set(AnimName, true);
				if (ReplicateInfo.HasFeintStop && !this.ReplicatesPlayed.has(AnimName))
					Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						this.Character.Abilities.AbilitiesFeint.set(AnimName, false),
					);
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
			if ("AnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => {
					ReplicateClass.AnimStop!(animTrack, AnimName);
					this.ReplicatesPlaying.delete(AnimName);
				});
			else Butler.Connect(animTrack.Stopped, () => this.ReplicatesPlaying.delete(AnimName));

			if (ReplicateInfo.Sound) {
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
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
		}

		this.ReplicatesPlaying.add(AnimName);
		ReplicateClass.AnimPlay?.(animTrack, AnimName);
	}

	public Destroy() {
		this.ReplicateModules.clear();

		this.StopModules.forEach((replicateClass) => {
			replicateClass.Destroy!();
			this.StopModules.delete(replicateClass);
		});

		this.ReplicatesPlayed.clear();
		this.ReplicatesPlaying.clear();
	}
}
