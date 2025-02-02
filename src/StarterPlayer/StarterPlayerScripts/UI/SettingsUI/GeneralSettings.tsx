import React, { forwardRef } from "@rbxts/react";
import { SettingsToggle } from "./Components/SettingsToggle";
import { UIPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsGeneral } from "ReplicatedStorage/Enums/Settings/ESettingsGeneral";
import { SettingsDecision } from "./Components/SettingsDecision";
import { EDecision } from "../../../../ReplicatedStorage/Enums/UI/EDecision";

const Player = Players.LocalPlayer;
SettingsManager.WaitForSettings(Player);

export const GeneralSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="General" VerticalFlex={false}>
			<SettingsToggle
				Title="FPS/MS"
				Explanation="Show or hide FPS and MS visualizer"
				InitialValue={false}
				LayoutOrder={0}
				ToggleChanged={(activated: boolean) =>
					SettingsManager.SetSetting(Player, ESettingsGeneral.FPSMS, activated)
				}
			/>
			<SettingsDecision
				Title="Locked Camera"
				Explanation="Select the camera's lock direction"
				InitialValue={EDecision.Two}
				LayoutOrder={1}
				OptionOne="Left"
				OptionTwo="Right"
				DecisionChanged={(decision: number) =>
					SettingsManager.SetSetting(Player, ESettingsGeneral.LockedCamera, decision)
				}
			/>
		</UIPanel>
	);
});
