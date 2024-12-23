/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Players } from "@rbxts/services";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import Object from "@rbxts/object-utils";

export class ReplicateClient {
	public Character: Character;
	public ReplicateModules: Map<EAnimations | string, IReplicateClass>;
	public DestroyModules: Set<IReplicateClass>;
	public ReplicatesPlayed: Set<EAnimations | string>;
	public SelfReplicatesPlayed: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Moves = character.Moves;
		const Animator = character.Humanoid.Animator;

		this.ReplicateModules = new Map();
		this.DestroyModules = new Set();
		this.ReplicatesPlayed = new Set();
		this.SelfReplicatesPlayed = new Set();

		Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
			this.AbilityAdded(abilityPlace, weapon, ability),
		);

		Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
			this.AbilityRemoved(abilityPlace, weapon, ability),
		);

		Butler.Connect(Moves.MoveSetChanged, (oldSet, newSet) => task.spawn(() => this.MoveSetChanged(oldSet, newSet)));

		if (character.Player && character.Player === Players.LocalPlayer)
			Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.SelfAnimationPlayed(animTrack));

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.AnimationPlayed(animTrack));

		task.spawn(() => this.InitializeDefaultModules());
		task.spawn(() => {
			const NewSet = this.Character.Moves.MoveSet;
			if (!NewSet) return;
			this.MoveSetChanged(undefined!, NewSet);
		});
	}

	public InitializeDefaultModules() {
		const ClassDash = new (ModuleManager.GetReplicate("Dash"))(this.Character);
		const ClassFootsteps = new (ModuleManager.GetReplicate("Footsteps"))(this.Character);

		this.DestroyModules.add(ClassDash);
		this.DestroyModules.add(ClassFootsteps);

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

		this.Character.Abilities.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => {
			this.AbilityAdded(undefined as unknown as number, undefined as unknown as EWeapon, ability as EAbility);
		});
	}

	public AbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		this.ReplicateModules.set(ability, classByName);
		if ("Destroy" in classByName) this.DestroyModules.add(classByName);
	}

	public AbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		if (this.DestroyModules.delete(ReplicateClass)) ReplicateClass.Destroy!();

		this.ReplicateModules.delete(ability);
	}

	public MoveSetChanged(oldSet: string, newSet: string) {
		if (oldSet) {
			for (const weapon of Object.values(EWeapon)) {
				for (const move of Object.values(EMove)) {
					let Name = `${oldSet}_${weapon}_${move}`;
					let ReplicateClass = this.ReplicateModules.get(Name);

					if (!ReplicateClass) {
						if (newSet === EMoveSet.Default) continue;
						Name = `${EMoveSet.Default}_${weapon}_${move}`;
						ReplicateClass = this.ReplicateModules.get(Name);
						if (!ReplicateClass) continue;
					}

					if (this.DestroyModules.delete(ReplicateClass)) ReplicateClass.Destroy!();
					this.ReplicateModules.delete(Name);
				}
			}
		}

		for (const weapon of Object.values(EWeapon)) {
			for (const move of Object.values(EMove)) {
				let Name = `${newSet}_${weapon}_${move}`;
				let classByName = ModuleManager.GetReplicate(Name);

				if (!classByName) {
					if (newSet === EMoveSet.Default) continue;
					Name = `${EMoveSet.Default}_${weapon}_${move}`;
					classByName = ModuleManager.GetReplicate(Name);
					if (!classByName) continue;
				}

				const classNew = new classByName(this.Character);
				this.ReplicateModules.set(Name, classNew);
				if ("Destroy" in classByName) this.DestroyModules.add(classNew);
			}
		}
	}

	private ReadSoundString(soundString: string) {
		const parts = soundString.split(",");
		const SoundName = parts[0] ?? "";
		const Start = tonumber(parts[1]) ?? 0;
		const Volume = tonumber(parts[2]) ?? 1;
		const Speed = tonumber(parts[3]) ?? 1;

		return [SoundName, Start, Volume, Speed];
	}

	public SelfAnimationPlayed(animTrack: AnimationTrack) {
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

		if (!ReplicateInfo.CanUseStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) return;
		}

		if (
			(ReplicateInfo.Ability && !Abilities.Has(ReplicateName)) ||
			(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
			Attributes.UsingMove()
		)
			return;

		if (!this.SelfReplicatesPlayed.has(AnimName)) {
			this.SelfReplicatesPlayed.add(AnimName);
			ReplicateClass.SelfAnimPlayOnce?.(animTrack, AnimName);
			if ("SelfAnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => ReplicateClass.SelfAnimStop!(animTrack, AnimName));
		}

		ReplicateClass.SelfAnimPlay?.(animTrack, AnimName);
	}

	public AnimationPlayed(animTrack: AnimationTrack) {
		const AnimName = Tools.IdToName(animTrack.Animation!.AnimationId);
		const ReplicateInfo = ModuleManager.GetReplicateInfo(AnimName);
		if (!ReplicateInfo) return;
		const ReplicateName = ReplicateInfo.Class ?? AnimName;
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const Character = this.Character;
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

		const Butler = Character.Butler;
		const Abilities = Character.Abilities;
		const Moves = Character.Moves;
		const Weapons = Character.Weapons;

		if (ReplicateInfo.Ability) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingMove()
			) {
				animTrack.Stop();
				return;
			}

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) {
				animTrack.Stop();
				return;
			}

			if (ReplicateInfo.CanFeint) {
				Abilities.AbilitiesFeint.add(AnimName);
				if (ReplicateInfo.HasFeintStop && !this.ReplicatesPlayed.has(AnimName))
					Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						Abilities.AbilitiesFeint.delete(AnimName),
					);
			}
		}

		if (ReplicateInfo.Move) {
			const Split = AnimName.split("_");
			if (
				Moves.MoveSet !== Split[0] ||
				(Attributes.UsingMove() && Attributes.UsingMove() !== ReplicateName) ||
				Attributes.UsingAbility()
			) {
				animTrack.Stop();
				return;
			}

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) {
				animTrack.Stop();
				return;
			}

			if (ReplicateInfo.CanFeint) {
				Moves.MovesFeint.add(AnimName);
				if (ReplicateInfo.HasFeintStop && !this.ReplicatesPlayed.has(AnimName))
					Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						Moves.MovesFeint.delete(AnimName),
					);
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
			if ("AnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => ReplicateClass.AnimStop!(animTrack, AnimName));

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

		ReplicateClass.AnimPlay?.(animTrack, AnimName);
	}

	public Destroy() {
		this.ReplicateModules.clear();

		this.DestroyModules.forEach((replicateClass) => {
			replicateClass.Destroy!();
			this.DestroyModules.delete(replicateClass);
		});

		this.ReplicatesPlayed.clear();
		this.SelfReplicatesPlayed.clear();

		this.ReplicateModules = undefined!;
		this.DestroyModules = undefined!;
		this.ReplicatesPlayed = undefined!;
		this.SelfReplicatesPlayed = undefined!;
	}
}
