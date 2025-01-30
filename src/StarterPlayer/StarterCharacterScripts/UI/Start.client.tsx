import { useEffect, useRef } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, StarterGui, Workspace } from "@rbxts/services";
import { ParametersUI } from "./ParametersUI/ParametersUI";
import React from "@rbxts/react";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as PlayerGui;
const Root = createRoot(Workspace.WaitForChild("UI"));

let ParametersRef: CanvasGroup | undefined;

function InitGUI() {
	const parametersRef = useRef<CanvasGroup>(undefined!);

	useEffect(() => {
		if (parametersRef.current) ParametersRef = parametersRef.current;
	}, [parametersRef.current]);

	return (
		<screengui ScreenInsets={"None"} IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={"Sibling"}>
			<ParametersUI ref={parametersRef} Opacity={0} Position={UDim2.fromScale(0.5, 0.5)} Interactable={true} />
		</screengui>
	);
}

Root.render(createPortal(<InitGUI />, PlayerGui));
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false);
Workspace.CurrentCamera!.CameraType = Enum.CameraType.Custom;
script.Destroying.Once(() => Root.unmount());
