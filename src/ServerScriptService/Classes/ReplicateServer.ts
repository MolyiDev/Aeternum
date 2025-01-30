/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from "../../ReplicatedStorage/Classes/Character";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CReplicate } from "../../ReplicatedStorage/Classes/Abstracts/CReplicate";
import Object from "@rbxts/object-utils";

export class ReplicateServer {
	public Character: Character;
	public ReplicateModules: Map<EAnimations | string, CReplicate>;
	public ReplicatesPlayed: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Styles = character.Styles;
		const Animator = character.Humanoid.Animator;

		this.ReplicateModules = new Map();
		this.ReplicatesPlayed = new Set();

		Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
			this.AbilityAdded(abilityPlace, weapon, ability),
		);

		Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
			this.AbilityRemoved(abilityPlace, weapon, ability),
		);

		Butler.Connect(Styles.StylesChanged, (oldSet, newSet) => task.spawn(() => this.StyleChanged(oldSet, newSet)));

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.AnimationPlayed(animTrack));

		task.spawn(() => this.InitializeDefaultModules());
	}

	public InitializeDefaultModules() {
		this.Character.Abilities.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => {
			this.AbilityAdded(undefined as unknown as number, undefined as unknown as EWeapon, ability as EAbility);
		});

		const NewSet = this.Character.Styles.Style;
		if (NewSet) this.StyleChanged(undefined!, NewSet);
	}

	public AbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		if (this.ReplicateModules.has(ability)) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		this.ReplicateModules.set(ability, classByName);
	}

	public AbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		ReplicateClass.Destroy!();

		this.ReplicateModules.delete(ability);
	}

	public StyleChanged(oldStyle: string, newStyle: string) {
		if (oldStyle) {
			for (const weapon of Object.values(EWeapon)) {
				for (const styleType of Object.values(EStyleType)) {
					let Name = `${oldStyle}_${weapon}_${styleType}`;
					let ReplicateClass = this.ReplicateModules.get(Name);

					if (!ReplicateClass) {
						if (newStyle === EStyle.Default) continue;
						Name = `${EStyle.Default}_${weapon}_${styleType}`;
						ReplicateClass = this.ReplicateModules.get(Name);
						if (!ReplicateClass) continue;
					}

					ReplicateClass.Destroy!();
					this.ReplicateModules.delete(Name);
				}
			}
		}

		for (const weapon of Object.values(EWeapon)) {
			for (const styleType of Object.values(EStyleType)) {
				let Name = `${newStyle}_${weapon}_${styleType}`;
				let classByName = ModuleManager.GetReplicate(Name);

				if (!classByName) {
					if (newStyle === EStyle.Default) continue;
					Name = `${EStyle.Default}_${weapon}_${styleType}`;
					classByName = ModuleManager.GetReplicate(Name);
					if (!classByName) continue;
				}

				const classNew = new classByName(this.Character);
				this.ReplicateModules.set(Name, classNew);
			}
		}
	}

	public AnimationPlayed(animTrack: AnimationTrack) {
		const AnimName = Tools.IdToName(animTrack.Animation!.AnimationId);
		const ReplicateInfo = ModuleManager.GetReplicateInfo(AnimName);
		if (!ReplicateInfo) return;

		const ReplicateName = ReplicateInfo.ReplicateClass ?? AnimName;
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const Character = this.Character;
		const Attributes = Character.Attributes;

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) {
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
		const Styles = Character.Styles;
		const Weapons = Character.Weapons;

		if (ReplicateInfo.AbilityClass) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingStyle()
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

		if (ReplicateInfo.StyleClass) {
			const Split = ReplicateInfo.StyleClass.split("_");
			if (
				Styles.Style !== Split[0] ||
				(Attributes.UsingStyle() && Attributes.UsingStyle() !== Split[2]) ||
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
				Styles.StylesFeint.add(AnimName);
				if (ReplicateInfo.HasFeintStop && !this.ReplicatesPlayed.has(AnimName))
					Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						Styles.StylesFeint.delete(AnimName),
					);
			}
		}

		if (!this.ReplicatesPlayed.has(AnimName)) {
			this.ReplicatesPlayed.add(AnimName);
			ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);
			if ("AnimStop" in ReplicateClass)
				Butler.Connect(animTrack.Stopped, () => {
					ReplicateClass.AnimStop!(animTrack, AnimName);
				});
		}

		ReplicateClass.AnimPlay?.(animTrack, AnimName);
	}

	public SignalFired(ReplicateName: string, ...args: Array<unknown>) {
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const ReplicateInfo = ModuleManager.GetReplicateInfo(ReplicateName)!;

		const Attributes = this.Character.Attributes;

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) return;
		}

		const Abilities = this.Character.Abilities;
		const Styles = this.Character.Styles;
		const Weapons = this.Character.Weapons;

		if (ReplicateInfo.AbilityClass) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingStyle()
			)
				return;

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) return;
		}

		if (ReplicateInfo.StyleClass) {
			const Split = ReplicateInfo.StyleClass.split("_");

			if (
				Styles.Style !== Split[0] ||
				(Attributes.UsingStyle() && Attributes.UsingStyle() !== Split[2]) ||
				Attributes.UsingAbility()
			)
				return;

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) return;
		}

		return ReplicateClass.Fired!(...args);
	}

	public SignalFiredServer(ReplicateName: string, ...args: Array<unknown>) {
		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const ReplicateInfo = ModuleManager.GetReplicateInfo(ReplicateName)!;

		const Attributes = this.Character.Attributes;

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) return;
		}

		const Abilities = this.Character.Abilities;
		const Styles = this.Character.Styles;
		const Weapons = this.Character.Weapons;

		if (ReplicateInfo.AbilityClass) {
			if (
				!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingStyle()
			)
				return;

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) return;
		}

		if (ReplicateInfo.StyleClass) {
			const Split = ReplicateInfo.StyleClass.split("_");

			if (
				Styles.Style !== Split[0] ||
				(Attributes.UsingStyle() && Attributes.UsingStyle() !== Split[2]) ||
				Attributes.UsingAbility()
			)
				return;

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) return;
		}

		return ReplicateClass.FiredServer!(...args);
	}

	public Destroy() {
		this.ReplicateModules.forEach((replicateClass, name) => {
			replicateClass.Destroy();
			this.ReplicateModules.delete(name);
		});

		this.ReplicatesPlayed.clear();

		this.Character = undefined!;
		this.ReplicateModules = undefined!;
		this.ReplicatesPlayed = undefined!;
	}
}
