/* eslint-disable roblox-ts/lua-truthiness */
import { Lighting, Players } from "@rbxts/services";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { WindManager } from "ReplicatedStorage/Managers/WindManager";

const Player = Players.LocalPlayer;
SettingsManager.WaitForSettings(Player);

Lighting.Bloom.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.Bloom) as boolean;
Lighting.Blur.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.Blur) as boolean;
Lighting.DepthOfField.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.DepthOfField) as boolean;
Lighting.SunRays.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.SunRays) as boolean;
Lighting.GlobalShadows = SettingsManager.GetSetting(Player, ESettingsVisual.Shadows) as boolean;

if (SettingsManager.GetSetting(Player, ESettingsVisual.Wind)) WindManager.Init();
