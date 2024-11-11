import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "StarterGui/SettingsUI/Components/SettingsDragger";
import { SettingsToggle } from "./Components/SettingsToggle";
import { SettingsPanel } from "./Components/SettingsPanel";
import { Lighting, Players } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { WindManager } from "ReplicatedStorage/Managers/WindManager";

const Player = Players.LocalPlayer;

export const VisualSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<SettingsPanel ref={ref} name="Visual" flexAlign={true}>
			<SettingsToggle
				title="Wind"
				explanation="Toggle wind"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Wind) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Wind, activated);
					if (activated) WindManager.Init();
					else WindManager.CleanUp();
				}}
			/>
			<SettingsToggle
				title="Bloom"
				explanation="Toggle bloom"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Bloom) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Bloom, activated);
					Lighting.Bloom.Enabled = activated;
				}}
			/>
			<SettingsToggle
				title="Blur"
				explanation="Toggle blur"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Blur) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Blur, activated);
					Lighting.Blur.Enabled = activated;
				}}
			/>
			<SettingsToggle
				title="Depth of Field"
				explanation="Toggle depth of field"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.DepthOfField) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.DepthOfField, activated);
					Lighting.DepthOfField.Enabled = activated;
				}}
			/>
			<SettingsToggle
				title="Sun Rays"
				explanation="Toggle sun rays"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.SunRays) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.SunRays, activated);
					Lighting.SunRays.Enabled = activated;
				}}
			/>
			<SettingsToggle
				title="Shadows"
				explanation="Toggle shadows"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Shadows) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Shadows, activated);
					Lighting.GlobalShadows = activated;
				}}
			/>
			<SettingsToggle
				title="Volumetric Shadows"
				explanation="Toggle volumetric shadows"
				initialValue={SettingsManager.GetSetting(Player, ESettingsVisual.VolumetricShadows) as boolean}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.VolumetricShadows, activated);
				}}
			/>
			<SettingsDragger
				title="Debris"
				explanation="Amount of debris (Rocks)"
				initialValue={(SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) * 100}
				minDrag={25}
				maxDrag={250}
				dragAmount={1}
				textModifier="%"
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.Debris, value / 100)
				}
			/>
			<SettingsDragger
				title="Sub-Debris"
				explanation="Amount of sub-debris (Rocks on top of rocks)"
				initialValue={(SettingsManager.GetSetting(Player, ESettingsVisual.SubDebris) as number) * 100}
				minDrag={0}
				maxDrag={250}
				dragAmount={1}
				textModifier="%"
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.SubDebris, value / 100)
				}
			/>
		</SettingsPanel>
	);
});
