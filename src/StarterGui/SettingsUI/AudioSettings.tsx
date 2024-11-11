import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "./Components/SettingsDragger";
import { SettingsPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsAudio } from "ReplicatedStorage/Enums/Settings/ESettingsAudio";

const Player = Players.LocalPlayer;

export const AudioSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<SettingsPanel ref={ref} name="Audio" flexAlign={false}>
			<SettingsDragger
				title="Overall"
				explanation="Volume of all sounds"
				initialValue={(SettingsManager.GetSetting(Player, ESettingsAudio.Overall) as number) * 100}
				minDrag={0}
				maxDrag={100}
				layoutOrder={0}
				dragAmount={1}
				textModifier="%"
				ValueChanged={(value) => SettingsManager.SetSetting(Player, ESettingsAudio.Overall, value / 100)}
			/>
			<SettingsDragger
				title="Music"
				explanation="Volume of the music"
				initialValue={(SettingsManager.GetSetting(Player, ESettingsAudio.Music) as number) * 100}
				minDrag={0}
				maxDrag={100}
				layoutOrder={1}
				dragAmount={5}
				textModifier="%"
				ValueChanged={(value) => SettingsManager.SetSetting(Player, ESettingsAudio.Music, value / 100)}
			/>
			<SettingsDragger
				title="Effects"
				explanation="Volume of the effects"
				initialValue={(SettingsManager.GetSetting(Player, ESettingsAudio.Effects) as number) * 100}
				minDrag={0}
				maxDrag={100}
				layoutOrder={2}
				dragAmount={10}
				textModifier="%"
				ValueChanged={(value) => SettingsManager.SetSetting(Player, ESettingsAudio.Effects, value / 100)}
			/>
		</SettingsPanel>
	);
});
