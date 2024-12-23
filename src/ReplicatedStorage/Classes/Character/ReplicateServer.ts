/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import Object from "@rbxts/object-utils";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";

export class ReplicateServer {
	public Character: Character;
	public ReplicateModules: Map<EAnimations | string, IReplicateClass>;
	public DestroyModules: Set<IReplicateClass>;
	public ReplicatesPlayed: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Moves = character.Moves;
		const Animator = character.Humanoid.Animator;

		this.ReplicateModules = new Map();
		this.DestroyModules = new Set();
		this.ReplicatesPlayed = new Set();

		Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
			this.AbilityAdded(abilityPlace, weapon, ability),
		);

		Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
			this.AbilityRemoved(abilityPlace, weapon, ability),
		);

		Butler.Connect(Moves.MoveSetChanged, (oldSet, newSet) => task.spawn(() => this.MoveSetChanged(oldSet, newSet)));

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.AnimationPlayed(animTrack));

		task.spawn(() => this.InitializeDefaultModules());
	}

	public InitializeDefaultModules() {
		const ClassDash = new (ModuleManager.GetReplicate("Dash"))(this.Character);

		this.DestroyModules.add(ClassDash);

		this.ReplicateModules.set(EAnimations.DashForward, ClassDash);
		this.ReplicateModules.set(EAnimations.DashBack, ClassDash);
		this.ReplicateModules.set(EAnimations.DashLeft, ClassDash);
		this.ReplicateModules.set(EAnimations.DashRight, ClassDash);
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

			Attributes.SetUsingAbility(ReplicateName);
			Attributes.SetUsingAbilityAnim(AnimName);

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

			Attributes.SetUsingMove(ReplicateName);
			Attributes.SetUsingMoveAnim(AnimName);

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
				Butler.Connect(animTrack.Stopped, () => {
					ReplicateClass.AnimStop!(animTrack, AnimName);
					if (ReplicateInfo.Ability) {
						Attributes.SetUsingAbility(undefined);
						Attributes.SetUsingAbilityAnim(undefined);
					} else if (ReplicateInfo.Move) {
						Attributes.SetUsingMove(undefined);
						Attributes.SetUsingMoveAnim(undefined);
					}
				});
			else
				Butler.Connect(animTrack.Stopped, () => {
					if (ReplicateInfo.Ability) {
						Attributes.SetUsingAbility(undefined);
						Attributes.SetUsingAbilityAnim(undefined);
					} else if (ReplicateInfo.Move) {
						Attributes.SetUsingMove(undefined);
						Attributes.SetUsingMoveAnim(undefined);
					}
				});
		}

		ReplicateClass.AnimPlay?.(animTrack, AnimName);
	}

	public SignalFired(ReplicateName: string) {
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const ReplicateInfo = ModuleManager.GetReplicateInfo(ReplicateName)!;

		const Character = this.Character;
		const Attributes = Character.Attributes;

		if (!ReplicateInfo.CanUseStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) return;
		}

		const Abilities = Character.Abilities;
		const Moves = Character.Moves;
		const Weapons = Character.Weapons;

		if (ReplicateInfo.Ability) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingMove()
			)
				return;

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) return;

			Attributes.SetUsingAbility(ReplicateName);
			Attributes.SetUsingAbilityAnim(ReplicateName);
		}

		if (ReplicateInfo.Move) {
			const Split = ReplicateName.split("_");
			if (
				Moves.MoveSet !== Split[0] ||
				(Attributes.UsingMove() && Attributes.UsingMove() !== ReplicateName) ||
				Attributes.UsingAbility()
			)
				return;

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) return;

			Attributes.SetUsingMove(ReplicateName);
			Attributes.SetUsingMoveAnim(ReplicateName);
		}

		ReplicateClass.Signal!();
	}

	public Destroy() {
		this.ReplicateModules.clear();

		this.DestroyModules.forEach((replicateClass) => {
			replicateClass.Destroy!();
			this.DestroyModules.delete(replicateClass);
		});

		this.ReplicatesPlayed.clear();

		this.ReplicateModules = undefined!;
		this.ReplicatesPlayed = undefined!;
		this.DestroyModules = undefined!;
	}
}
