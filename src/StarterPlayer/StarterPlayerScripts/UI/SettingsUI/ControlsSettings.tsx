import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "./Components/SettingsDragger";
import { UIPanel } from "./Components/SettingsPanel";
import { Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";

const Player = Players.LocalPlayer;
SettingsManager.WaitForSettings(Player);

export const ControlsSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="Controls" VerticalFlex={false}>
			<SettingsDragger
				Title="Double Tap Threshold"
				Explanation="Minimum time between two consecutive taps"
				InitialValue={
					(SettingsManager.GetSetting(Player, ESettingsControls.DoubleTapThreshold) as number) ?? 0.2
				}
				MinDrag={0.1}
				MaxDrag={1}
				TextMaxDigits={4}
				LayoutOrder={0}
				DragAmount={0.1}
				TextModifier=""
				ValueChanged={(value) =>
					SettingsManager.SetSetting(Player, ESettingsControls.DoubleTapThreshold, value)
				}
			/>
		</UIPanel>
	);
});
