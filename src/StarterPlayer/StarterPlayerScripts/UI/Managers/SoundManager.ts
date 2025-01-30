import { Players, SoundService } from "@rbxts/services";
import { EUISound } from "./EUISound";
import { ESettingsAudio } from "ReplicatedStorage/Enums/Settings/ESettingsAudio";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";

const Player = Players.LocalPlayer;
const MusicGroup = SoundService.WaitForChild("Music") as SoundGroup;
const EffectsGroup = SoundService.WaitForChild("Effects") as SoundGroup;
const UIGroup = SoundService.WaitForChild("UI") as SoundGroup;

export class SoundManager {
	public static PlayUI(sound: EUISound) {}

	public static Volume(volumeType: ESettingsAudio, volume?: number) {
		const OverallVolume = SettingsManager.GetSetting(Player, ESettingsAudio.Overall) as number;

		switch (volumeType) {
			case ESettingsAudio.Overall:
				{
					const MusicVolume = SettingsManager.GetSetting(Player, ESettingsAudio.Music) as number;
					const EffectsVolume = SettingsManager.GetSetting(Player, ESettingsAudio.Effects) as number;
					const UIVolume = SettingsManager.GetSetting(Player, ESettingsAudio.UI) as number;

					EffectsGroup.Volume = EffectsVolume * OverallVolume;
					MusicGroup.Volume = MusicVolume * OverallVolume;
					UIGroup.Volume = UIVolume * OverallVolume;
				}
				break;
			case ESettingsAudio.Effects:
				EffectsGroup.Volume = volume! * OverallVolume;
				break;
			case ESettingsAudio.Music:
				MusicGroup.Volume = volume! * OverallVolume;
				break;
			case ESettingsAudio.UI:
				UIGroup.Volume = volume! * OverallVolume;
				break;
		}
	}
}

SoundManager.Volume(ESettingsAudio.Overall);
