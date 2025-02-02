import React, { forwardRef } from "@rbxts/react";
import { SettingsDragger } from "StarterPlayer/StarterPlayerScripts/UI/SettingsUI/Components/SettingsDragger";
import { SettingsToggle } from "./Components/SettingsToggle";
import { UIPanel } from "./Components/SettingsPanel";
import { Lighting, Players, Workspace } from "@rbxts/services";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { WindManager } from "ReplicatedStorage/Managers/WindManager";

const Player = Players.LocalPlayer;
SettingsManager.WaitForSettings(Player);

export const VisualSettings = forwardRef<CanvasGroup>((props, ref) => {
	return (
		<UIPanel ref={ref} Key="Visual" VerticalFlex={true}>
			<SettingsDragger
				Title="Render Distance"
				Explanation="Define the distance in studs for effects"
				InitialValue={(SettingsManager.GetSetting(Player, ESettingsVisual.RenderDistance) as number) ?? 250}
				MinDrag={50}
				MaxDrag={2500}
				DragAmount={25}
				TextModifier=""
				LayoutOrder={0}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.RenderDistance, value)
				}
			/>
			<SettingsDragger
				Title="Particles"
				Explanation="Define the amount of particles"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.Particles) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={200}
				DragAmount={10}
				TextModifier="%"
				LayoutOrder={1}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.Particles, value / 100)
				}
			/>
			<SettingsDragger
				Title="Debris"
				Explanation="Define the amount of debris (rocks)"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1) * 100}
				MinDrag={25}
				MaxDrag={200}
				DragAmount={25}
				TextModifier="%"
				LayoutOrder={2}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.Debris, value / 100)
				}
			/>
			<SettingsDragger
				Title="Sub-Debris"
				Explanation="Define the amount of sub-debris (rocks on other rocks)"
				InitialValue={((SettingsManager.GetSetting(Player, ESettingsVisual.SubDebris) as number) ?? 1) * 100}
				MinDrag={0}
				MaxDrag={200}
				DragAmount={25}
				TextModifier="%"
				LayoutOrder={3}
				ValueChanged={(value: number) =>
					SettingsManager.SetSetting(Player, ESettingsVisual.SubDebris, value / 100)
				}
			/>

			<SettingsToggle
				Title="Shadows"
				Explanation="Activate or deactivate shadows"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Shadows) as boolean}
				LayoutOrder={4}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Shadows, activated);
					Lighting.GlobalShadows = activated;
				}}
			/>
			<SettingsToggle
				Title="Clouds"
				Explanation="Activate or deactivate clouds"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Clouds) as boolean}
				LayoutOrder={5}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Clouds, activated);
					(Workspace.Terrain.FindFirstChild("Clouds") as Clouds).Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Bloom"
				Explanation="Activate or deactivate bloom"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Bloom) as boolean}
				LayoutOrder={6}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Bloom, activated);
					Lighting.Bloom.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Blur"
				Explanation="Activate or deactivate blur"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Blur) as boolean}
				LayoutOrder={7}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Blur, activated);
					Lighting.Blur.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Depth of Field"
				Explanation="Activate or deactivate depth of field"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.DepthOfField) as boolean}
				LayoutOrder={8}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.DepthOfField, activated);
					Lighting.DepthOfField.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Sun Rays"
				Explanation="Activate or deactivate sun rays"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.SunRays) as boolean}
				LayoutOrder={9}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.SunRays, activated);
					Lighting.SunRays.Enabled = activated;
				}}
			/>
			<SettingsToggle
				Title="Wind"
				Explanation="Activate or deactivate wind"
				InitialValue={SettingsManager.GetSetting(Player, ESettingsVisual.Wind) as boolean}
				LayoutOrder={10}
				ToggleChanged={(activated: boolean) => {
					SettingsManager.SetSetting(Player, ESettingsVisual.Wind, activated);
					if (activated) WindManager.Init();
					else WindManager.CleanUp();
				}}
			/>
		</UIPanel>
	);
});
