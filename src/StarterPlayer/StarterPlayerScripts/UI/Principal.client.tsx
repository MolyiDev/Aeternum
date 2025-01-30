import React, { useRef } from "@rbxts/react";
import { Icon } from "@rbxts/topbar-plus";
import { SettingsUI } from "./SettingsUI/SettingsUI";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players, ReplicatedStorage, RunService, StarterGui, Workspace } from "@rbxts/services";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { PrincipalUI } from "./PrincipalUI/PrincipalUI";
import { ESettingsGeneral } from "ReplicatedStorage/Enums/Settings/ESettingsGeneral";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { CreditsUI } from "./CreditsUI/CreditsUI";

const PlayEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Play") as RemoteEvent;

const TInfo = new TweenInfo(0.55, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

const Player = Players.LocalPlayer;
const Mouse = Player.GetMouse();
const Camera = Workspace.Camera!;
const CameraPosition = Workspace.WaitForChild("CameraPosition") as BasePart;
const PlayerGui = Player.WaitForChild("PlayerGui") as PlayerGui;
const Root = createRoot(Workspace.WaitForChild("UI"));
SettingsManager.WaitForSettings(Player);

function InitGUI() {
	const principalRef = useRef<CanvasGroup>(undefined!);
	const settingsRef = useRef<CanvasGroup>(undefined!);
	const creditsRef = useRef<CanvasGroup>(undefined!);

	let SettingsIcon: Icon;

	const CameraSensitivity = 0.15;
	const MaxOffset = 25;

	function SettingsIconSelected() {
		if (!settingsRef.current) return;
		settingsRef.current.Position = UDim2.fromScale(0.5, 0.7);
		settingsRef.current.Interactable = true;
		Tools.TweenPlay(settingsRef.current, TInfo, {
			Position: UDim2.fromScale(0.5, 0.5),
			GroupTransparency: 0,
		});
		SettingsIcon.deselect();
		Icon.setTopbarEnabled(false);
	}

	const MoveMouse = Mouse.Move.Connect(() => {
		const viewportSize = Camera.ViewportSize;

		const OffsetX = ((Mouse.X - viewportSize.X / 2) / (viewportSize.X / 2)) * MaxOffset;
		const OffsetY = ((Mouse.Y - viewportSize.Y / 2) / (viewportSize.Y / 2)) * MaxOffset;

		Camera.CFrame = CameraPosition.CFrame.mul(
			CFrame.Angles(math.rad(-OffsetY * CameraSensitivity), math.rad(-OffsetX * CameraSensitivity), 0),
		);
	});

	return (
		<screengui
			DisplayOrder={2}
			ScreenInsets={"None"}
			IgnoreGuiInset={true}
			ResetOnSpawn={false}
			ZIndexBehavior={"Sibling"}
		>
			<PrincipalUI
				ref={principalRef}
				Opacity={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Interactable={true}
				PlayTouched={() => {
					PlayEvent.FireServer();
					MoveMouse.Disconnect();

					SettingsIcon = new Icon()
						.setImage("rbxassetid://14897656651")
						.autoDeselect(true)
						.disableOverlay(true);
					SettingsIcon.selected.Connect(SettingsIconSelected);

					const FpsIcon = new Icon()
						.setLabel("FPS: 0", "Deselected")
						.autoDeselect(false)
						.disableOverlay(true)
						.lock()
						.setEnabled(SettingsManager.GetSetting(Player, ESettingsGeneral.FPSMS) as boolean);
					const PingIcon = new Icon()
						.setLabel("Ping: 0", "Deselected")
						.autoDeselect(false)
						.disableOverlay(true)
						.lock()
						.setEnabled(SettingsManager.GetSetting(Player, ESettingsGeneral.FPSMS) as boolean);
					const SpeedIcon = new Icon()
						.setLabel("Speed: 0", "Deselected")
						.autoDeselect(false)
						.disableOverlay(true)
						.lock();

					let Fps = 0;
					let Time = 0;

					RunService.RenderStepped.Connect((dt) => {
						Fps += 1;
						Time += dt;

						if (Player.Character && (Player.Character as IModel).Humanoid) {
							const WalkSpeed = (Player.Character as IModel).Humanoid.WalkSpeed;
							SpeedIcon.setLabel(
								`Speed: ${WalkSpeed !== undefined ? string.format("%.2f", WalkSpeed) : "0.00"}`,
							);
						}

						if (Time >= 1) {
							FpsIcon.setLabel(`FPS: ${math.floor(Fps / Time)}`, "Deselected");
							Fps = 0;
							Time = 0;

							PingIcon.setLabel(`Ping: ${math.floor(Player.GetNetworkPing() * 1000)}`, "Deselected");
						}
					});

					Player.AttributeChanged.Connect((attribute) => {
						if (attribute !== ESettingsGeneral.FPSMS) return;
						FpsIcon.setEnabled(SettingsManager.GetSetting(Player, ESettingsGeneral.FPSMS) as boolean);
						PingIcon.setEnabled(SettingsManager.GetSetting(Player, ESettingsGeneral.FPSMS) as boolean);
					});
				}}
				SettingsTouched={() => {
					settingsRef.current.Position = UDim2.fromScale(0.5, 0.7);
					settingsRef.current.Interactable = true;
					Tools.TweenPlay(settingsRef.current, TInfo, {
						Position: UDim2.fromScale(0.5, 0.5),
						GroupTransparency: 0,
					});
				}}
				CreditsTouched={() => {
					creditsRef.current.Position = UDim2.fromScale(0.5, 0.7);
					creditsRef.current.Interactable = true;
					Tools.TweenPlay(creditsRef.current, TInfo, {
						Position: UDim2.fromScale(0.5, 0.5),
						GroupTransparency: 0,
					});
				}}
			/>
			<SettingsUI
				ref={settingsRef}
				Opacity={1}
				Position={UDim2.fromScale(0.5, 10)}
				Interactable={false}
				CloseTouched={() => {
					if (!Player.Character) {
						principalRef.current.Interactable = true;

						Tools.TweenPlay(principalRef.current, TInfo, {
							Position: UDim2.fromScale(0.5, 0.5),
							GroupTransparency: 0,
						});

						return;
					}
					StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, true);
					Icon.setTopbarEnabled(true);
				}}
			/>
			<CreditsUI
				ref={creditsRef}
				Opacity={1}
				Position={UDim2.fromScale(0.5, 10)}
				Interactable={false}
				CloseTouched={() => {
					principalRef.current.Interactable = true;

					Tools.TweenPlay(principalRef.current, TInfo, {
						Position: UDim2.fromScale(0.5, 0.5),
						GroupTransparency: 0,
					});
				}}
			/>
		</screengui>
	);
}

Root.render(createPortal(<InitGUI />, PlayerGui));
