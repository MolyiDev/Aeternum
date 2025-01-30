/* eslint-disable roblox-ts/lua-truthiness */
import { Lighting, Players, Workspace } from "@rbxts/services";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { WindManager } from "ReplicatedStorage/Managers/WindManager";

const Player = Players.LocalPlayer;
const CameraPosition = Workspace.WaitForChild("CameraPosition") as BasePart;
SettingsManager.WaitForSettings(Player);

(Workspace.Terrain.FindFirstChild("Clouds") as Clouds).Enabled = SettingsManager.GetSetting(
	Player,
	ESettingsVisual.Clouds,
) as boolean;

Lighting.Bloom.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.Bloom) as boolean;
Lighting.Blur.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.Blur) as boolean;
Lighting.DepthOfField.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.DepthOfField) as boolean;
Lighting.SunRays.Enabled = SettingsManager.GetSetting(Player, ESettingsVisual.SunRays) as boolean;
Lighting.GlobalShadows = SettingsManager.GetSetting(Player, ESettingsVisual.Shadows) as boolean;

if (SettingsManager.GetSetting(Player, ESettingsVisual.Wind)) WindManager.Init();

const Camera = Workspace.CurrentCamera!;
Camera.CameraType = Enum.CameraType.Custom;
task.wait(0.1);
Camera.CameraType = Enum.CameraType.Scriptable;
Camera.CFrame = CameraPosition.CFrame;
