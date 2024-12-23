/* eslint-disable no-constant-condition */
import React, { StrictMode, useEffect, useRef } from "@rbxts/react";
import { Icon } from "@rbxts/topbar-plus";
import { SettingsGUI } from "./SettingsUI/SettingsGUI";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, RunService, Workspace } from "@rbxts/services";
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
			<SettingsGUI ref={settingsRef} opacity={1} position={UDim2.fromScale(0.5, 10)} interactable={false} />
		</screengui>
	);
}

root.render(<StrictMode>{createPortal(<InitSettingsGUI />, PlayerGui)}</StrictMode>);

const icon = new Icon()
	.setImage("rbxassetid://14897656651")
	.setLabel("Settings", "Viewing")
	.setLabel("Settings", "Selected")
	.autoDeselect(true)
	.disableOverlay(true);

const PingIcon = new Icon().setLabel("Ping: 0", "Deselected").autoDeselect(false).disableOverlay(true).lock();
const FpsIcon = new Icon().setLabel("FPS: 0", "Deselected").autoDeselect(false).disableOverlay(true).lock();

icon.selected.Connect(() => {
	if (!SettingsRef) return;
	SettingsRef.Position = UDim2.fromScale(0.5, 0.7);
	SettingsRef.Interactable = true;
	Tools.TweenPlay(SettingsRef, TWEENINFO_PANEL, {
		Position: UDim2.fromScale(0.5, 0.5),
		GroupTransparency: 0,
	});
	icon.deselect();
	Icon.setTopbarEnabled(false);
});

let Fps = 0;
let Time = 0;

RunService.RenderStepped.Connect((dt) => {
	Fps += 1;
	Time += dt;

	if (Time >= 1) {
		FpsIcon.setLabel(`FPS: ${math.floor(Fps / Time)}`, "Deselected");
		Fps = 0;
		Time = 0;

		PingIcon.setLabel(`Ping: ${math.floor(Player.GetNetworkPing() * 1000)}`, "Deselected");
	}
});
