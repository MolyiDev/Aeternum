import React, { forwardRef } from "@rbxts/react";
import { SettingsToggle } from "./Components/SettingsToggle";
import { SettingsPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsGeneral } from "ReplicatedStorage/Enums/Settings/ESettingsGeneral";

const Player = Players.LocalPlayer;

export const GeneralSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<SettingsPanel ref={ref} name="General" flexAlign={false}>
			<SettingsToggle
				title="FPS/MS"
				explanation="Toggle visualizer for fps and ms"
				initialValue={SettingsManager.GetSetting(Player, ESettingsGeneral.FPSMS) as boolean}
				ToggleChanged={(activated: boolean) =>
					SettingsManager.SetSetting(Player, ESettingsGeneral.FPSMS, activated)
				}
			/>
		</SettingsPanel>
	);
});
