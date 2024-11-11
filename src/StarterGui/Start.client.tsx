import React, { StrictMode, useEffect, useRef } from "@rbxts/react";
import { Icon } from "@rbxts/topbar-plus";
import { SettingsGUI } from "./SettingsUI/SettingsGUI";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, StarterGui, Workspace } from "@rbxts/services";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";

const TWEENINFO_PANEL = new TweenInfo(0.55, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as PlayerGui;

SettingsManager.WaitForSettings(Player);

const root = createRoot(new Instance("Folder", Workspace));

let SettingsRef: CanvasGroup | undefined;

function InitSettingsGUI() {
	const settingsRef = useRef<CanvasGroup>(undefined!);

	useEffect(() => {
		if (settingsRef.current) SettingsRef = settingsRef.current;
	}, [settingsRef.current]);

	return (
		<screengui IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={"Sibling"}>
			<SettingsGUI ref={settingsRef} opacity={1} interactable={false} />
		</screengui>
	);
}

root.render(<StrictMode>{createPortal(<InitSettingsGUI />, PlayerGui)}</StrictMode>);

const icon = new Icon()
	.setImage("rbxassetid://14897656651")
	.setLabel("Settings", "Viewing")
	.setLabel("Settings", "Selected")
	.autoDeselect(true);

icon.selected.Connect(() => {
	Icon.setTopbarEnabled(false);
	if (!SettingsRef) return;
	SettingsRef.Position = UDim2.fromScale(0.5, 0.7);
	SettingsRef.Interactable = true;
	StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);
	Tools.TweenPlay(SettingsRef, TWEENINFO_PANEL, {
		Position: UDim2.fromScale(0.5, 0.5),
		GroupTransparency: 0,
	});
	icon.deselect();
});
