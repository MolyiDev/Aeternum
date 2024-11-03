/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EAbilityPlace } from "ReplicatedStorage/Enums/Abilities/EAbilityPlace";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EReplicateInfo } from "ReplicatedStorage/Enums/Replicate/EReplicateInfo";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

export class ReplicateServer {
	public Character: Character;
	public ReplicateAnimations: Map<EAnimations | string, IReplicateClass>;
	public ReplicateSignals: Map<EAnimations | string, IReplicateClass>;
	public StopModules: Set<IReplicateClass>;
	public ReplicatesPlayed: Set<EAnimations | string>;
	public ReplicatesPlaying: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Animator = character.Humanoid.Animator;

		this.ReplicateAnimations = new Map();
		this.ReplicateSignals = new Map();
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

		this.StopModules.add(ClassDash);

		this.ReplicateAnimations.set(EAnimations.DashForward, ClassDash);
		this.ReplicateAnimations.set(EAnimations.DashBack, ClassDash);
		this.ReplicateAnimations.set(EAnimations.DashLeft, ClassDash);
		this.ReplicateAnimations.set(EAnimations.DashRight, ClassDash);
	}

	public AbilityAdded(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const ReplicateInfo = EReplicateInfo.get(ability);
		if (!ReplicateInfo) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		if (ReplicateInfo.Signal) this.ReplicateSignals.set(ability, classByName);
		else this.ReplicateAnimations.set(ability, classByName);

		if ("Destroy" in classByName) this.StopModules.add(classByName);
	}

	public AbilityRemoved(abilityPlace: EAbilityPlace, weapon: EWeapons, ability: EAbility) {
		const ReplicateClass = this.ReplicateAnimations.get(ability);
		if (!ReplicateClass) return;
		if (this.StopModules.delete(ReplicateClass)) ReplicateClass.Destroy!();

		this.ReplicateAnimations.delete(ability);
	}

	public AnimationPlayed(animTrack: AnimationTrack) {
		const AnimName = Tools.IdToName(animTrack.Animation!.AnimationId);
		const ReplicateInfo = EReplicateInfo.get(AnimName);
		if (!ReplicateInfo) return;
		const ReplicateName = ReplicateInfo.Class ? ReplicateInfo.Class : AnimName;
		const ReplicateClass = this.ReplicateAnimations.get(ReplicateName);
		if (!ReplicateClass) return;

		const Character = this.Character;
		const Butler = Character.Butler;
		const Abilities = Character.Abilities;
		const Attributes = Character.Attributes;

		if (
			ReplicateInfo.Ability &&
			(!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingMove())
		) {
			animTrack.Stop();
			return;
		}

		if (!ReplicateInfo.CanUseStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) {
				animTrack.Stop();
				return;
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
			if ("AnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => {
					ReplicateClass.AnimStop!(animTrack, AnimName);
					this.ReplicatesPlaying.delete(AnimName);
					if (ReplicateInfo.Ability) Attributes.SetUsingAbility(undefined);
				});
			else
				Butler.Connect(animTrack.Stopped, () => {
					this.ReplicatesPlaying.delete(AnimName);
					if (ReplicateInfo.Ability) Attributes.SetUsingAbility(undefined);
				});
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
		}

		this.ReplicatesPlaying.add(AnimName);
		ReplicateClass.AnimPlay?.(animTrack, AnimName);
		if (ReplicateInfo.Ability) Attributes.SetUsingAbility(AnimName);
	}

	public SignalFired(ability: EAbility) {
		const ReplicateClass = this.ReplicateSignals.get(ability);
		if (!ReplicateClass) return;

		const ReplicateInfo = EReplicateInfo.get(ability)!;

		const Character = this.Character;
		const Abilities = Character.Abilities;
		const Attributes = Character.Attributes;

		if (
			ReplicateInfo.Ability &&
			(!Abilities.Has(ability) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ability) ||
				Attributes.UsingMove())
		)
			return;

		if (!ReplicateInfo.CanUseStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ability);
			if (time < ReplicateInfo.Cooldown) return;
		}

		ReplicateClass.Signal!();
		if (ReplicateInfo.Ability) Attributes.SetUsingAbility(ability);
	}

	public Destroy() {
		this.ReplicateAnimations.clear();

		this.StopModules.forEach((replicateClass) => {
			replicateClass.Destroy!();
			this.StopModules.delete(replicateClass);
		});

		this.ReplicatesPlayed.clear();
		this.ReplicatesPlaying.clear();
	}
}
