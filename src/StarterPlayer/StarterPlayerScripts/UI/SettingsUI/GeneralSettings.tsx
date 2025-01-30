import React, { forwardRef } from "@rbxts/react";
import { SettingsToggle } from "./Components/SettingsToggle";
import { UIPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsGeneral } from "ReplicatedStorage/Enums/Settings/ESettingsGeneral";
import { SettingsDecision } from "./Components/SettingsDecision";
import { EDecision } from "../../../../ReplicatedStorage/Enums/UI/EDecision";

const Player = Players.LocalPlayer;

export const GeneralSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="General" VerticalFlex={false}>
			<SettingsToggle
				Title="FPS/MS"
				Explanation="Toggle visualizer for FPS and MS"
				InitialValue={false}
				LayoutOrder={0}
				ToggleChanged={(activated: boolean) =>
					SettingsManager.SetSetting(Player, ESettingsGeneral.FPSMS, activated)
				}
			/>
			<SettingsDecision
				Title="Locked Camera"
				Explanation="The direction where it will go the camera when it's locked"
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
