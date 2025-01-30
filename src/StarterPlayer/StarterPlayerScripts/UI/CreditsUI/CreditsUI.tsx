import React, { forwardRef, useImperativeHandle, useRef } from "@rbxts/react";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SpecialButton } from "StarterPlayer/StarterPlayerScripts/UI/Components/SpecialButton";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../Components/SliceScale";
import { TextLabelShadow } from "../Components/Shadows";
import { UIPanel } from "../SettingsUI/Components/SettingsPanel";
import { CreditsPanel } from "./CreditsPanel";

const TWEENINFO_PANEL = new TweenInfo(0.55, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const DEFAULT_COLOR = Color3.fromRGB(255, 255, 255);
const SELECTED_COLOR = Color3.fromRGB(0, 0, 0);

interface ICreditsUI {
	Opacity?: number;
	Position: UDim2;
	Interactable?: boolean;
	CloseTouched: () => void;
}

export const CreditsUI = forwardRef<CanvasGroup, ICreditsUI>((props, ref) => {
	const creditsRef = useRef<CanvasGroup>(undefined!);
	const sliceScale = useScale(2.55);

	useImperativeHandle(ref, () => creditsRef.current);

	return (
		<canvasgroup
			ref={creditsRef}
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
				<UIPanel Opacity={0} VerticalFlex={false}>
					<CreditsPanel Name="Molyi" Description="Programmer, UI Designer" LayoutOrder={0} />
					<CreditsPanel Name="Chapex" Description="Animator, 3D Modeler" LayoutOrder={1} />
					<CreditsPanel Name="Whinrer" Description="VFX Artist" LayoutOrder={2} />
				</UIPanel>
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
							const tween = Tools.TweenPlay(creditsRef.current, TWEENINFO_PANEL, {
								Position: UDim2.fromScale(0.5, 0.7),
								GroupTransparency: 1,
							});
							tween.Completed.Once(() => (creditsRef.current.Position = UDim2.fromScale(0.5, 10)));
							creditsRef.current.Interactable = false;
							props.CloseTouched();
						},
					}}
				/>
			</canvasgroup>

			<canvasgroup BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.15)}>
				<TextLabelShadow
					AnchorPoint={AnchorPoints.Top}
					Position={UDim2.fromScale(0.5, 0.15)}
					Size={UDim2.fromScale(0.24, 0.55)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					Text={"Credits"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Center}
					ShadowAngle={45}
					ShadowTransparency={0.55}
					ShadowDistance={5}
				/>

				<frame
					AnchorPoint={AnchorPoints.Bottom}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.8)}
					Size={UDim2.fromScale(0.983, 0.035)}
				>
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, SELECTED_COLOR),
								new ColorSequenceKeypoint(0.15, DEFAULT_COLOR),

								new ColorSequenceKeypoint(0.5 - 0.03, DEFAULT_COLOR),
								new ColorSequenceKeypoint(0.5, SELECTED_COLOR),
								new ColorSequenceKeypoint(0.5 + 0.03, DEFAULT_COLOR),

								new ColorSequenceKeypoint(0.85, DEFAULT_COLOR),
								new ColorSequenceKeypoint(1, SELECTED_COLOR),
							])
						}
					/>

					<imagelabel
						BackgroundTransparency={1}
						AnchorPoint={AnchorPoints.Center}
						Image={"rbxassetid://109254184865400"}
						ImageColor3={SELECTED_COLOR}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.022, 7.061)}
					>
						<uiaspectratioconstraint AspectRatio={1.038} />
					</imagelabel>
				</frame>
			</canvasgroup>
		</canvasgroup>
	);
});
