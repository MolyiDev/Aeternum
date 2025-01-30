/* eslint-disable roblox-ts/lua-truthiness */
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Players, SoundService } from "@rbxts/services";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import Object from "@rbxts/object-utils";
import { CReplicate } from "../Abstracts/CReplicate";

const EffectsGroup = SoundService.WaitForChild("Effects") as SoundGroup;

export class ReplicateClient {
	public Character: Character;
	public ReplicateModules: Map<EAnimations | string, CReplicate>;
	public ReplicatesPlayed: Set<EAnimations | string>;
	public SelfReplicatesPlayed: Set<EAnimations | string>;

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Styles = character.Styles;
		const Animator = character.Humanoid.Animator;

		this.ReplicateModules = new Map();
		this.ReplicatesPlayed = new Set();
		this.SelfReplicatesPlayed = new Set();

		if (character.Player && character.Player === Players.LocalPlayer) {
			Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
				this.SelfAbilityAdded(abilityPlace, weapon, ability),
			);

			Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
				this.SelfAbilityRemoved(abilityPlace, weapon, ability),
			);

			Butler.Connect(Styles.StylesChanged, (oldSet, newSet) =>
				task.spawn(() => this.SelfStyleChanged(oldSet, newSet)),
			);

			Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.SelfAnimationPlayed(animTrack));
		} else {
			Butler.Connect(Abilities.AbilityAdded, (abilityPlace, weapon, ability) =>
				this.AbilityAdded(abilityPlace, weapon, ability),
			);

			Butler.Connect(Abilities.AbilityRemoved, (abilityPlace, weapon, ability) =>
				this.AbilityRemoved(abilityPlace, weapon, ability),
			);

			Butler.Connect(Styles.StylesChanged, (oldSet, newSet) =>
				task.spawn(() => this.StyleChanged(oldSet, newSet)),
			);
		}

		Butler.Connect(Animator.AnimationPlayed, (animTrack) => this.AnimationPlayed(animTrack));

		task.spawn(() => this.InitializeDefaultModules());
	}

	public InitializeDefaultModules() {
		ModuleManager.LoadReplicate("ReceiveAttack");
		ModuleManager.LoadReplicate(EAnimations.Default_Hands_ReceiveAttackCombo);
		ModuleManager.LoadReplicate(EAnimations.ElectricKickReceive);

		const ClassRagdoll = new (ModuleManager.GetReplicate("Ragdoll"))(this.Character);
		this.ReplicateModules.set(EAnimations.Ragdoll, ClassRagdoll);

		if (this.Character.Player && this.Character.Player === Players.LocalPlayer) {
			this.Character.Abilities.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => {
				this.SelfAbilityAdded(
					undefined as unknown as number,
					undefined as unknown as EWeapon,
					ability as EAbility,
				);
			});

			const NewSet = this.Character.Styles.Style;
			if (NewSet) this.SelfStyleChanged(undefined!, NewSet);
		} else {
			this.Character.Abilities.AbilitiesFolder.GetAttributes().forEach((attributeValue, ability) => {
				this.AbilityAdded(undefined as unknown as number, undefined as unknown as EWeapon, ability as EAbility);
			});

			const NewSet = this.Character.Styles.Style;
			if (NewSet) this.StyleChanged(undefined!, NewSet);
		}
	}

	public AbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		if (this.ReplicateModules.has(ability)) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		this.ReplicateModules.set(ability, classByName);
	}

	public AbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		ReplicateClass.Destroy();

		this.ReplicateModules.delete(ability);
	}

	public SelfAbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		if (this.ReplicateModules.has(ability)) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		classByName.SelfConstruct?.();
		this.ReplicateModules.set(ability, classByName);
	}

	public SelfAbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		ReplicateClass.SelfDestroy!();
		ReplicateClass.Destroy!();

		this.ReplicateModules.delete(ability);
	}

	public StyleChanged(oldStyle: string, newStyle: string) {
		if (oldStyle) {
			for (const weapon of Object.values(EWeapon)) {
				for (const styleType of Object.values(EStyleType)) {
					let Name = `${oldStyle}_${weapon}_${styleType}`;
					let StyleInfo = ModuleManager.GetStyleInfo(Name);

					if (!StyleInfo) {
						if (oldStyle === EStyle.Default) continue;
						Name = `${EStyle.Default}_${weapon}_${styleType}`;
						StyleInfo = ModuleManager.GetStyleInfo(Name);
						if (!StyleInfo) continue;
					}

					const ReplicateName = StyleInfo.ReplicateClass ?? Name;
					const ReplicateClass = this.ReplicateModules.get(ReplicateName);

					if (!ReplicateClass) continue;

					ReplicateClass.Destroy!();
					this.ReplicateModules.delete(ReplicateName);
				}
			}
		}

		for (const weapon of Object.values(EWeapon)) {
			for (const styleType of Object.values(EStyleType)) {
				let Name = `${newStyle}_${weapon}_${styleType}`;
				let StyleInfo = ModuleManager.GetStyleInfo(Name);

				if (!StyleInfo) {
					if (newStyle === EStyle.Default) continue;
					Name = `${EStyle.Default}_${weapon}_${styleType}`;
					StyleInfo = ModuleManager.GetStyleInfo(Name);
					if (!StyleInfo) continue;
				}

				const ReplicateName = StyleInfo.ReplicateClass ?? Name;
				const classByName = ModuleManager.GetReplicate(ReplicateName);

				if (!classByName) continue;

				const classNew = new classByName(this.Character);
				this.ReplicateModules.set(ReplicateName, classNew);
			}
		}
	}

	public SelfStyleChanged(oldStyle: string, newStyle: string) {
		if (oldStyle) {
			for (const weapon of Object.values(EWeapon)) {
				for (const styleType of Object.values(EStyleType)) {
					let Name = `${oldStyle}_${weapon}_${styleType}`;
					let StyleInfo = ModuleManager.GetStyleInfo(Name);

					if (!StyleInfo) {
						if (oldStyle === EStyle.Default) continue;
						Name = `${EStyle.Default}_${weapon}_${styleType}`;
						StyleInfo = ModuleManager.GetStyleInfo(Name);
						if (!StyleInfo) continue;
					}

					const ReplicateName = StyleInfo.ReplicateClass ?? Name;
					const ReplicateClass = this.ReplicateModules.get(ReplicateName);

					if (!ReplicateClass) continue;

					ReplicateClass.SelfDestroy()!;
					this.ReplicateModules.delete(ReplicateName);
				}
			}
		}

		for (const weapon of Object.values(EWeapon)) {
			for (const styleType of Object.values(EStyleType)) {
				let Name = `${newStyle}_${weapon}_${styleType}`;
				let StyleInfo = ModuleManager.GetStyleInfo(Name);

				if (!StyleInfo) {
					if (newStyle === EStyle.Default) continue;
					Name = `${EStyle.Default}_${weapon}_${styleType}`;
					StyleInfo = ModuleManager.GetStyleInfo(Name);
					if (!StyleInfo) continue;
				}

				const ReplicateName = StyleInfo.ReplicateClass ?? Name;
				const classByName = ModuleManager.GetReplicate(ReplicateName);

				if (!classByName) continue;

				const classNew = new classByName(this.Character);
				classNew.SelfConstruct?.();
				this.ReplicateModules.set(ReplicateName, classNew);
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

		const Character = this.Character;
		const Attributes = Character.Attributes;
		const ReplicateName = ReplicateInfo.ReplicateClass ?? AnimName;

		if (ReplicateInfo.Receive) {
			if (Attributes.Receive() !== ReplicateName) return;
			if (!this.ReplicateModules.has(ReplicateName))
				this.ReplicateModules.set(ReplicateName, new (ModuleManager.GetReplicate(ReplicateName))(Character));
		}

		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) return;

		const Butler = Character.Butler;
		const Abilities = Character.Abilities;

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) return;

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) return;
		}

		if (
			ReplicateInfo.AbilityClass &&
			(!Abilities.Has(ReplicateName) ||
				(Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) ||
				Attributes.UsingStyle())
		)
			return;

		if (ReplicateInfo.StyleClass) {
			const Split = ReplicateInfo.StyleClass.split("_");
			if (
				this.Character.Styles.Style !== Split[0] ||
				(Attributes.UsingStyle() && Attributes.UsingStyle() !== Split[2]) ||
				Attributes.UsingAbility()
			)
				return;
		}

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

		const Character = this.Character;
		const Attributes = Character.Attributes;
		const ReplicateName = ReplicateInfo.ReplicateClass ?? AnimName;

		if (ReplicateInfo.Receive) {
			if (Attributes.Receive() !== ReplicateName) {
				if (this.Character.Player) print(1);
				animTrack.Stop();
				return;
			}
			if (!this.ReplicateModules.has(ReplicateName))
				this.ReplicateModules.set(ReplicateName, new (ModuleManager.GetReplicate(ReplicateName))(Character));
		}

		const ReplicateClass = this.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) {
			if (this.Character.Player) print(2);
			animTrack.Stop();
			return;
		}

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) {
			if (this.Character.Player) print(3);
			animTrack.Stop();
			return;
		}

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) {
				if (this.Character.Player) print(4);
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
				if (this.Character.Player) print(5);
				animTrack.Stop();
				return;
			}

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) {
				if (this.Character.Player) print(6);
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
				if (this.Character.Player) print(7);
				animTrack.Stop();
				return;
			}

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) {
				if (this.Character.Player) print(8);
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
					SoundClone.SoundGroup = EffectsGroup;
					SoundClone.Destroy();
				});
			}
		}

		ReplicateClass.AnimPlay?.(animTrack, AnimName);
	}

	public Destroy() {
		if (this.Character.Player && this.Character.Player === Players.LocalPlayer) {
			this.ReplicateModules.forEach((replicateClass, name) => {
				replicateClass.SelfDestroy();
				replicateClass.Destroy();
				this.ReplicateModules.delete(name);
			});
		} else {
			this.ReplicateModules.forEach((replicateClass, name) => {
				replicateClass.SelfDestroy();
				this.ReplicateModules.delete(name);
			});
		}

		this.ReplicatesPlayed.clear();
		this.SelfReplicatesPlayed.clear();

		this.Character = undefined!;
		this.ReplicateModules = undefined!;
		this.ReplicatesPlayed = undefined!;
		this.SelfReplicatesPlayed = undefined!;
	}
}
