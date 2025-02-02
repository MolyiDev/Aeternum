import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "./Components/SettingsDragger";
import { UIPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsAudio } from "ReplicatedStorage/Enums/Settings/ESettingsAudio";
import { SoundManager } from "../Managers/SoundManager";

const Player = Players.LocalPlayer;
SettingsManager.WaitForSettings(Player);

export const AudioSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="Audio" VerticalFlex={false}>
			<SettingsDragger
				Title="Overall"
				Explanation="Master volume level"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsAudio.Overall) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={100}
				LayoutOrder={0}
				DragAmount={1}
				TextModifier="%"
				ValueChanged={(value) => {
					const Volume = value / 100;
					SettingsManager.SetSetting(Player, ESettingsAudio.Overall, Volume);
					SoundManager.Volume(ESettingsAudio.Overall, Volume);
				}}
			/>
			<SettingsDragger
				Title="Music"
				Explanation="Music volume level"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsAudio.Music) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={100}
				LayoutOrder={1}
				DragAmount={1}
				TextModifier="%"
				ValueChanged={(value) => {
					const Volume = value / 100;
					SettingsManager.SetSetting(Player, ESettingsAudio.Music, Volume);
					SoundManager.Volume(ESettingsAudio.Music, Volume);
				}}
			/>
			<SettingsDragger
				Title="Effects"
				Explanation="Sound effects volume level"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsAudio.Effects) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={100}
				LayoutOrder={2}
				DragAmount={1}
				TextModifier="%"
				ValueChanged={(value) => {
					const Volume = value / 100;
					SettingsManager.SetSetting(Player, ESettingsAudio.Effects, Volume);
					SoundManager.Volume(ESettingsAudio.Effects, Volume);
				}}
			/>
			<SettingsDragger
				Title="UI"
				Explanation="UI sounds volume level"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsAudio.UI) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={100}
				LayoutOrder={3}
				DragAmount={1}
				TextModifier="%"
				ValueChanged={(value) => {
					const Volume = value / 100;
					SettingsManager.SetSetting(Player, ESettingsAudio.UI, Volume);
					SoundManager.Volume(ESettingsAudio.UI, Volume);
				}}
			/>
		</UIPanel>
	);
});
