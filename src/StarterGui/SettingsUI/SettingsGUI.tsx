import { AnchorPoints, CanvasGroup, Frame } from "@rbxts/better-react-components";
import {
	GradientElement,
	createColorSequence,
	createNumberSequence,
} from "@rbxts/better-react-components/out/helpers/Gradient";
import React, { forwardRef, useImperativeHandle, useRef } from "@rbxts/react";
import { UpBar } from "./UpBar";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AudioSettings } from "./AudioSettings";
import { VisualSettings } from "./VisualSettings";
import { SpecialButton } from "StarterGui/Components/SpecialButton";
import { ESettingsPanels } from "./Components/Enums/ESettingsPanels";
import { GeneralSettings } from "./GeneralSettings";
import { StarterGui } from "@rbxts/services";
import { Icon } from "@rbxts/topbar-plus";

const TWEENINFO_PANEL = new TweenInfo(0.55, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

interface ISettingsGUI {
	opacity?: number;
	interactable?: boolean;
}

export const SettingsGUI = forwardRef<CanvasGroup, ISettingsGUI>((props, ref) => {
	const audioPanelRef = useRef<CanvasGroup>(undefined!);
	const visualPanelRef = useRef<CanvasGroup>(undefined!);
	const generalPanelRef = useRef<CanvasGroup>(undefined!);

	const settingsRef = useRef<CanvasGroup>(undefined!);

	useImperativeHandle(ref, () => settingsRef.current);

	return (
		<CanvasGroup
			ref={settingsRef}
			noBackground
			anchorPoint={AnchorPoints.Middle}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			opacity={props.opacity}
			interactable={props.interactable}
		>
			<Frame
				backgroundTransparency={0.2}
				anchorPoint={AnchorPoints.Middle}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
			>
				<GradientElement
					color={createColorSequence([Color3.fromRGB(22, 22, 22), Color3.fromRGB(49, 49, 49)])}
					rotation={90}
				/>
			</Frame>

			<Frame anchorPoint={AnchorPoints.Top} position={UDim2.fromScale(0.5, 0)} size={UDim2.fromScale(1, 0.225)}>
				<GradientElement
					color={createColorSequence([Color3.fromRGB(0, 0, 0), Color3.fromRGB(26, 26, 26)])}
					rotation={90}
					transparency={createNumberSequence([
						new NumberSequenceKeypoint(0, 0.3, 0),
						new NumberSequenceKeypoint(0.535, 0.475, 0),
						new NumberSequenceKeypoint(1, 1, 1),
					])}
				/>
			</Frame>

			<CanvasGroup
				noBackground
				anchorPoint={"m"}
				position={UDim2.fromScale(0.5, 0.558)}
				size={UDim2.fromScale(1, 0.883)}
			>
				<AudioSettings ref={audioPanelRef} />
				<VisualSettings ref={visualPanelRef} />
				<GeneralSettings ref={generalPanelRef} />
				<SpecialButton
					anchorPoint={"m"}
					text="Close"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					position={UDim2.fromScale(0.5, 0.92)}
					size={UDim2.fromScale(0.188, 0.105)}
					buttonColor={Color3.fromRGB(79, 28, 37)}
					insideButtonColor={Color3.fromRGB(94, 33, 41)}
					buttonStrokeColor={Color3.fromRGB(167, 59, 73)}
					imageEvent={{
						MouseButton1Up: () => {
							Tools.TweenPlay(settingsRef.current, TWEENINFO_PANEL, {
								Position: UDim2.fromScale(0.5, 0.7),
								GroupTransparency: 1,
							});
							StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, true);
							Icon.setTopbarEnabled(true);
							settingsRef.current.Interactable = false;
						},
					}}
				/>
			</CanvasGroup>

			<UpBar
				initialPanel={ESettingsPanels.Visual}
				audioPanel={audioPanelRef}
				visualPanel={visualPanelRef}
				generalPanel={generalPanelRef}
			/>
		</CanvasGroup>
	);
});
