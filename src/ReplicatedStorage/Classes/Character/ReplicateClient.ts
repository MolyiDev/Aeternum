/* eslint-disable roblox-ts/lua-truthiness */
import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Players, SoundService, Workspace } from "@rbxts/services";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import Object from "@rbxts/object-utils";
import { CReplicate } from "../Abstracts/CReplicate";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { EReplicateResult } from "ReplicatedStorage/Enums/EReplicateResult";
import { ReplicateManager } from "ReplicatedStorage/Managers/ReplicateManager";

const Player = Players.LocalPlayer;
const Camera = Workspace.CurrentCamera!;
const EffectsGroup = SoundService.WaitForChild("Effects") as SoundGroup;

export class ReplicateClient {
	public Character: Character;
	public ReplicateModules: Map<string, CReplicate> = new Map();
	public Replicated: Set<string> = new Set();
	public ReplicatesPlayed: Set<string> = new Set();
	public SelfReplicatesPlayed: Set<string> = new Set();

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;
		const Abilities = character.Abilities;
		const Styles = character.Styles;
		const Animator = character.Humanoid.Animator;

		if (character.Player === Player) {
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

	public AbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility | string) {
		if (this.ReplicateModules.has(ability)) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		this.ReplicateModules.set(ability, classByName);
	}

	public AbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility | string) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		ReplicateClass.Destroy();

		this.ReplicateModules.delete(ability);
	}

	public SelfAbilityAdded(abilityPlace: number, weapon: EWeapon, ability: EAbility | string) {
		if (this.ReplicateModules.has(ability)) return;
		const classByName = new (ModuleManager.GetReplicate(ability))(this.Character);
		classByName.SelfConstruct?.();
		this.ReplicateModules.set(ability, classByName);
	}

	public SelfAbilityRemoved(abilityPlace: number, weapon: EWeapon, ability: EAbility | string) {
		const ReplicateClass = this.ReplicateModules.get(ability);
		if (!ReplicateClass) return;
		ReplicateClass.SelfDestroy();
		ReplicateClass.Destroy();

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
		const [ReplicateClass, Results] = ReplicateManager.ReplicateHandlerClient(this, AnimName, true);

		for (const Result of Results) {
			if (Result === EReplicateResult.ReplicateOnce) {
				ReplicateClass.SelfAnimPlayOnce?.(animTrack, AnimName);

				if ("SelfAnimStop" in ReplicateClass)
					this.Character.Butler.Connect(animTrack.Stopped, () =>
						ReplicateClass.SelfAnimStop!(animTrack, AnimName),
					);
			} else if (Result === EReplicateResult.Replicate) ReplicateClass.SelfAnimPlay?.(animTrack, AnimName);
		}
	}

	public AnimationPlayed(animTrack: AnimationTrack) {
		const AnimName = Tools.IdToName(animTrack.Animation!.AnimationId);
		const [ReplicateClass, Results] = ReplicateManager.ReplicateHandlerClient(this, AnimName);

		for (const Result of Results) {
			switch (Result) {
				case EReplicateResult.Stop:
					animTrack.Stop();
					return;
				case EReplicateResult.Sound:
					this.Character.Butler.Connect(animTrack.GetMarkerReachedSignal("Sound"), (soundString?: string) => {
						if (
							Tools.VectorDistance(this.Character.HumanoidRootPart.Position, Camera.CFrame.Position) >
							(SettingsManager.GetSetting(Player, ESettingsVisual.RenderDistance) as number)
						)
							return;

						const [SoundName, Start, Volume, Speed] = this.ReadSoundString(soundString!);
						const Sound = Tools.SoundNameToSound(SoundName as string);
						const SoundClone = Sound.Clone();
						SoundClone.Parent = this.Character.HumanoidRootPart;
						SoundClone.TimePosition = Start as number;
						SoundClone.Volume = Volume as number;
						SoundClone.PlaybackSpeed = Speed as number;
						SoundClone.SoundGroup = EffectsGroup;
						SoundClone.Play();
						this.Character.Butler.Once(SoundClone.Stopped, () => SoundClone.Destroy());
					});
					break;
				case EReplicateResult.FeintAbility:
					this.Character.Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						this.Character.Abilities.AbilitiesFeint.delete(AnimName),
					);
					break;
				case EReplicateResult.FeintStyle:
					this.Character.Butler.Connect(animTrack.GetMarkerReachedSignal("StopFeint"), () =>
						this.Character.Styles.StylesFeint.delete(AnimName),
					);
					break;
				case EReplicateResult.ReplicateOnce:
					ReplicateClass.AnimPlayOnce?.(animTrack, AnimName);

					if ("AnimStop" in ReplicateClass)
						this.Character.Butler.Connect(animTrack.Stopped, () => {
							if (!this.Replicated.has(AnimName)) return;
							ReplicateClass.AnimStop!(animTrack, AnimName);
						});
					break;
				case EReplicateResult.Replicate:
					ReplicateClass.AnimPlay?.(animTrack, AnimName);
					break;
			}
		}
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
				replicateClass.Destroy();
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
