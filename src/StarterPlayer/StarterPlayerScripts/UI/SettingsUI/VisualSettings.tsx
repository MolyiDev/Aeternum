import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "StarterPlayer/StarterPlayerScripts/UI/SettingsUI/Components/SettingsDragger";
import { SettingsToggle } from "./Components/SettingsToggle";
import { UIPanel } from "./Components/SettingsPanel";
import { Lighting, Players, Workspace } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { WindManager } from "ReplicatedStorage/Managers/WindManager";

const Player = Players.LocalPlayer;

export const VisualSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="Visual" VerticalFlex={true}>
			<SettingsToggle
				Title="Wind"
				Explanation="Toggle wind"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Wind) as boolean}
				LayoutOrder={0}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Wind, activated);
					if (activated) WindManager.Init();
					else WindManager.CleanUp();
				}}
			/>
			<SettingsToggle
				Title="Clouds"
				Explanation="Toggle clouds"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Clouds) as boolean}
				LayoutOrder={1}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Clouds, activated);
					(Workspace.Terrain.FindFirstChild("Clouds") as Clouds).Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Bloom"
				Explanation="Toggle bloom"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Bloom) as boolean}
				LayoutOrder={2}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Bloom, activated);
					Lighting.Bloom.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Blur"
				Explanation="Toggle blur"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Blur) as boolean}
				LayoutOrder={3}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Blur, activated);
					Lighting.Blur.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Depth of Field"
				Explanation="Toggle depth of field"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.DepthOfField) as boolean}
				LayoutOrder={4}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.DepthOfField, activated);
					Lighting.DepthOfField.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Sun Rays"
				Explanation="Toggle sun rays"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.SunRays) as boolean}
				LayoutOrder={5}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.SunRays, activated);
					Lighting.SunRays.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Shadows"
				Explanation="Toggle shadows"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Shadows) as boolean}
				LayoutOrder={6}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Shadows, activated);
					Lighting.GlobalShadows = activated;
				}}
			/>
			<SettingsDragger
				Title="Particles"
				Explanation="Amount of particles"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.Particles) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={200}
				DragAmount={10}
				TextModifier="%"
				LayoutOrder={8}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.Particles, value / 100)
				}
			/>
			<SettingsDragger
				Title="Debris"
				Explanation="Amount of debris (Rocks)"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1) * 100}
				MinDrag={25}
				MaxDrag={200}
				DragAmount={25}
				TextModifier="%"
				LayoutOrder={9}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.Debris, value / 100)
				}
			/>
			<SettingsDragger
				Title="Sub-Debris"
				Explanation="Amount of sub-debris (Rocks on top of rocks)"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.SubDebris) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={200}
				DragAmount={25}
				TextModifier="%"
				LayoutOrder={10}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.SubDebris, value / 100)
				}
			/>
		</UIPanel>
	);
});
