import React, { useRef } from "@rbxts/react";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

interface IConfirmAlert {
	title?: string;
	description?: string;
	type?: "Red" | "Green" | "Yellow";
}

export function ConfirmAlert(props: IConfirmAlert) {
	const shineRef = useRef<ImageLabel>(undefined!);
	const boxRef = useRef<CanvasGroup>(undefined!);
	let colorGradient: Color3;
	let colorBackground: Color3;

	switch (props.type) {
		case "Red":
			colorGradient = Color3.fromRGB(43, 12, 10);
			colorBackground = Color3.fromRGB(50, 15, 20);
			break;
		case "Green":
			colorGradient = Color3.fromRGB(8, 37, 10);
			colorBackground = Color3.fromRGB(9, 36, 15);
			break;
		case "Yellow":
			colorGradient = Color3.fromRGB(71, 66, 10);
			colorBackground = Color3.fromRGB(77, 66, 20);
			break;
		default:
			colorGradient = Color3.fromRGB(196, 194, 194);
			colorBackground = Color3.fromRGB(203, 200, 205);
			break;
	}

	const BUTTON_DEFAULTY_Position = 0.9145;
	const BUTTON_HOVERY_Position = 0.895;
	const BOX_DEFAULT_Size = UDim2.fromScale(0.45, 0.325);
	const BOX_CLOSE_Size = UDim2.fromScale(0.4, 0.3);
	const TI_BUTTON = new TweenInfo(0.2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
	const TI_CLOSE = new TweenInfo(0.35, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

	function CloseAlert() {
		Tools.TweenPlay(shineRef.current, TI_CLOSE, { ImageTransparency: 1 });
		Tools.TweenPlay(boxRef.current, TI_CLOSE, {
			GroupTransparency: 1,
			Size: BOX_CLOSE_Size,
		});
	}

	return (
		<canvasgroup
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Center}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
		>
			<imagelabel
				ref={shineRef}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Size={UDim2.fromScale(1.25, 1.25)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image={"rbxassetid://125570236139912"}
				ImageColor3={colorBackground}
			/>
			<canvasgroup
				ref={boxRef}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Size={BOX_DEFAULT_Size}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				<frame
					AnchorPoint={AnchorPoints.Center}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
				>
					<uigradient Rotation={90} Color={new ColorSequence(colorGradient, Color3.fromRGB(11, 10, 15))} />
					<uicorner CornerRadius={new UDim(0.05)} />
				</frame>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.195)}
					Size={UDim2.fromScale(0.9, 0.195)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					TextScaled={true}
					Text={props.title}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={"Left"}
					TextYAlignment={"Top"}
				>
					<uitextsizeconstraint MaxTextSize={50} />
				</textlabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Top}
					Position={UDim2.fromScale(0.5, 0.25)}
					Size={UDim2.fromScale(0.9, 0.5)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Regular)}
					TextScaled={true}
					Text={props.description}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={"Left"}
					TextYAlignment={"Top"}
				>
					<uitextsizeconstraint MaxTextSize={50} />
				</textlabel>
				<textbutton
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					AnchorPoint={AnchorPoints.BottomRight}
					AutoButtonColor={false}
					Position={UDim2.fromScale(0.965, BUTTON_DEFAULTY_Position)}
					Size={UDim2.fromScale(0.185, 0.175)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					TextScaled={true}
					Text={"Continue"}
					TextColor3={Color3.fromRGB(0, 0, 0)}
					Event={{
						MouseEnter: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_HOVERY_Position),
							});
						},
						MouseLeave: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_DEFAULTY_Position),
							});
						},
						Activated: () => {
							CloseAlert();
						},
					}}
				>
					<uitextsizeconstraint MaxTextSize={43} />
					<uicorner CornerRadius={new UDim(0.2)} />
				</textbutton>
				<textbutton
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.BottomRight}
					AutoButtonColor={false}
					Position={UDim2.fromScale(0.755, BUTTON_DEFAULTY_Position)}
					Size={UDim2.fromScale(0.155, 0.175)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					TextScaled={true}
					Text={"Cancel"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Event={{
						MouseEnter: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_HOVERY_Position),
							});
						},
						MouseLeave: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_DEFAULTY_Position),
							});
						},
						Activated: () => {
							CloseAlert();
						},
					}}
				>
					<uistroke ApplyStrokeMode={"Border"} Thickness={2} Color={Color3.fromRGB(255, 255, 255)} />
					<uitextsizeconstraint MaxTextSize={43} />
					<uicorner CornerRadius={new UDim(0.2)} />
				</textbutton>
			</canvasgroup>
		</canvasgroup>
	);
}
