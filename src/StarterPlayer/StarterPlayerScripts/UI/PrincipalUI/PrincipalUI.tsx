import React, { forwardRef, useImperativeHandle, useRef } from "@rbxts/react";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { ImageLabelShadow } from "../Components/Shadows";
import { PrincipalButton } from "./Components/PrincipalButton";

const TINFOFADE = new TweenInfo(1, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TINFO = new TweenInfo(0.55, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

interface IPrincipalUI {
	Opacity?: number;
	Position: UDim2;
	Interactable?: boolean;
	PlayTouched: () => void;
	SettingsTouched: () => void;
	CreditsTouched: () => void;
}

export const PrincipalUI = forwardRef<CanvasGroup, IPrincipalUI>((props, ref) => {
	const principalRef = useRef<CanvasGroup>(undefined!);
	const fadeOutRef = useRef<Frame>(undefined!);

	useImperativeHandle(ref, () => principalRef.current);

	return (
		<>
			<frame
				ref={fadeOutRef}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				ZIndex={1}
			>
				<uigradient
					Rotation={-45}
					Color={new ColorSequence(Color3.fromRGB(10, 10, 10), Color3.fromRGB(35, 35, 35))}
				/>
			</frame>
			<canvasgroup
				ref={principalRef}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={props.Position}
				Size={UDim2.fromScale(1, 1)}
				GroupTransparency={props.Opacity}
				Interactable={props.Interactable}
				ZIndex={0}
			>
				<ImageLabelShadow
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.15)}
					Size={UDim2.fromOffset(1000, 250)}
					Image={"rbxassetid://119668941029486"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ShadowAngle={40}
					ShadowTransparency={0.4}
					ShadowDistance={6}
				/>

				<PrincipalButton
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.555)}
					Size={UDim2.fromScale(0.267, 0.237)}
					Type={"Play"}
					AspectRatio={2}
					Event={{
						Activated: () => {
							principalRef.current.Interactable = false;

							const tween = Tools.TweenPlay(fadeOutRef.current, TINFOFADE, {
								BackgroundTransparency: 0,
							});

							tween.Completed.Once(() => {
								principalRef.current.GroupTransparency = 1;
								props.PlayTouched();
								task.wait(1.25);
								Tools.TweenPlay(fadeOutRef.current, TINFOFADE, {
									BackgroundTransparency: 1,
								});
							});
						},
					}}
				/>

				<PrincipalButton
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.74)}
					Size={UDim2.fromScale(0.24, 0.214)}
					Type={"Settings"}
					AspectRatio={2}
					Event={{
						Activated: () => {
							principalRef.current.Interactable = false;

							Tools.TweenPlay(principalRef.current, TINFO, {
								Position: UDim2.fromScale(0.5, 0.3),
								GroupTransparency: 1,
							});

							props.SettingsTouched();
						},
					}}
				/>

				<PrincipalButton
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.9)}
					Size={UDim2.fromScale(0.227, 0.202)}
					Type={"Credits"}
					AspectRatio={2}
					Event={{
						Activated: () => {
							principalRef.current.Interactable = false;

							Tools.TweenPlay(principalRef.current, TINFO, {
								Position: UDim2.fromScale(0.5, 0.3),
								GroupTransparency: 1,
							});

							props.CreditsTouched();
						},
					}}
				/>
			</canvasgroup>
		</>
	);
});
