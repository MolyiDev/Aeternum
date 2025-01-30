import React, { forwardRef, useImperativeHandle, useRef } from "@rbxts/react";
import { UpBar } from "./UpBar";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AudioSettings } from "./AudioSettings";
import { VisualSettings } from "./VisualSettings";
import { SpecialButton } from "StarterPlayer/StarterPlayerScripts/UI/Components/SpecialButton";
import { ESettingsPanels } from "./Components/Enums/ESettingsPanels";
import { GeneralSettings } from "./GeneralSettings";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../Components/SliceScale";
import { ControlsSettings } from "./ControlsSettings";

const TWEENINFO_PANEL = new TweenInfo(0.55, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

interface ISettingsUI {
	Opacity?: number;
	Position: UDim2;
	Interactable?: boolean;
	CloseTouched: () => void;
}

export const SettingsUI = forwardRef<CanvasGroup, ISettingsUI>((props, ref) => {
	const audioPanelRef = useRef<CanvasGroup>(undefined!);
	const controlsPanelRef = useRef<CanvasGroup>(undefined!);
	const visualPanelRef = useRef<CanvasGroup>(undefined!);
	const generalPanelRef = useRef<CanvasGroup>(undefined!);

	const settingsRef = useRef<CanvasGroup>(undefined!);

	const sliceScale = useScale(2.55);

	useImperativeHandle(ref, () => settingsRef.current);

	return (
		<canvasgroup
			ref={settingsRef}
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Center}
			Position={props.Position}
			Size={UDim2.fromScale(1, 1)}
			GroupTransparency={props.Opacity}
			Interactable={props.Interactable}
		>
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={"rbxassetid://97790514446742"}
				ImageColor3={Color3.fromRGB(15, 15, 15)}
				ResampleMode={"Pixelated"}
				ScaleType={"Slice"}
				SliceCenter={new Rect(new Vector2(16, 16), new Vector2(32, 32))}
				SliceScale={sliceScale}
			/>
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.0775)}
				Size={UDim2.fromScale(1, 0.155)}
				Image={"rbxassetid://86052190956659"}
				ImageColor3={Color3.fromRGB(15, 15, 15)}
				ResampleMode={"Pixelated"}
				ScaleType={"Slice"}
				SliceCenter={new Rect(new Vector2(16, 16), new Vector2(32, 32))}
				SliceScale={sliceScale}
			>
				<uigradient
					Rotation={90}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0),
							new NumberSequenceKeypoint(0.7, 0.42),
							new NumberSequenceKeypoint(1, 1),
						])
					}
				/>
			</imagelabel>

			<canvasgroup
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.558)}
				Size={UDim2.fromScale(1, 0.883)}
			>
				<AudioSettings ref={audioPanelRef} />
				<ControlsSettings ref={controlsPanelRef} />
				<VisualSettings ref={visualPanelRef} />
				<GeneralSettings ref={generalPanelRef} />
				<SpecialButton
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.92)}
					Size={UDim2.fromScale(0.188, 0.105)}
					ButtonColor={Color3.fromRGB(12, 12, 12)}
					TextProps={{
						Text: "Close",
						TextColor3: Color3.fromRGB(255, 255, 255),
						FontFace: Font.fromName("TitilliumWeb", Enum.FontWeight.Bold),
					}}
					Event={{
						Activated: () => {
							const tween = Tools.TweenPlay(settingsRef.current, TWEENINFO_PANEL, {
								Position: UDim2.fromScale(0.5, 0.7),
								GroupTransparency: 1,
							});
							tween.Completed.Once(() => (settingsRef.current.Position = UDim2.fromScale(0.5, 10)));
							settingsRef.current.Interactable = false;
							props.CloseTouched();
						},
					}}
				/>
			</canvasgroup>

			<UpBar
				initialPanel={ESettingsPanels.Visual}
				audioPanel={audioPanelRef}
				controlsPanel={controlsPanelRef}
				visualPanel={visualPanelRef}
				generalPanel={generalPanelRef}
			/>
		</canvasgroup>
	);
});
