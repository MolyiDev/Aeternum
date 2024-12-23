import { CanvasGroup, Frame, Image, Text, TextButton } from "@rbxts/better-react-components";
import { createColorSequence } from "@rbxts/better-react-components/out/helpers/Gradient";
import React, { useRef } from "@rbxts/react";
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

	const BUTTON_DEFAULTY_POSITION = 0.9145;
	const BUTTON_HOVERY_POSITION = 0.895;
	const BOX_DEFAULT_SIZE = UDim2.fromScale(0.45, 0.325);
	const BOX_CLOSE_SIZE = UDim2.fromScale(0.4, 0.3);
	const TI_BUTTON = new TweenInfo(0.2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
	const TI_CLOSE = new TweenInfo(0.35, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

	function CloseAlert() {
		Tools.TweenPlay(shineRef.current, TI_CLOSE, { ImageTransparency: 1 });
		Tools.TweenPlay(boxRef.current, TI_CLOSE, {
			GroupTransparency: 1,
			Size: BOX_CLOSE_SIZE,
		});
	}

	return (
		<CanvasGroup noBackground anchorPoint={"m"} size={UDim2.fromScale(1, 1)} position={UDim2.fromScale(0.5, 0.5)}>
			<Image
				ref={shineRef}
				noBackground
				anchorPoint={"m"}
				size={UDim2.fromScale(1.25, 1.25)}
				position={UDim2.fromScale(0.5, 0.5)}
				image={"rbxassetid://125570236139912"}
				imageColor={colorBackground}
			/>
			<CanvasGroup
				ref={boxRef}
				noBackground
				anchorPoint={"m"}
				size={BOX_DEFAULT_SIZE}
				position={UDim2.fromScale(0.5, 0.5)}
			>
				<Frame
					anchorPoint={"m"}
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
					cornerRadius={0.05}
					background={createColorSequence([colorGradient, Color3.fromRGB(11, 10, 15)])}
					gradientRotation={90}
				/>
				<Text
					noBackground
					anchorPoint={"m"}
					position={UDim2.fromScale(0.5, 0.195)}
					size={UDim2.fromScale(0.9, 0.195)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					textSize={"AUTO"}
					text={props.title}
					textColor={Color3.fromRGB(255, 255, 255)}
					textAlign={"Left"}
					verticalTextAlign={"Top"}
					maxTextSize={50}
				/>
				<Text
					noBackground
					anchorPoint={"t"}
					position={UDim2.fromScale(0.5, 0.25)}
					size={UDim2.fromScale(0.9, 0.5)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Regular)}
					textSize={"AUTO"}
					text={props.description}
					textColor={Color3.fromRGB(255, 255, 255)}
					textAlign={"Left"}
					verticalTextAlign={"Top"}
					maxTextSize={40}
				/>
				<TextButton
					background={Color3.fromRGB(255, 255, 255)}
					anchorPoint={"br"}
					autoButtonColor={false}
					position={UDim2.fromScale(0.965, BUTTON_DEFAULTY_POSITION)}
					size={UDim2.fromScale(0.185, 0.175)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					textSize={"AUTO"}
					text={"Continue"}
					textColor={Color3.fromRGB(0, 0, 0)}
					maxTextSize={43}
					cornerRadius={0.2}
					event={{
						MouseEnter: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_HOVERY_POSITION),
							});
						},
						MouseLeave: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_DEFAULTY_POSITION),
							});
						},
						Activated: () => {
							CloseAlert();
						},
					}}
				/>
				<TextButton
					noBackground
					anchorPoint={"br"}
					autoButtonColor={false}
					position={UDim2.fromScale(0.755, BUTTON_DEFAULTY_POSITION)}
					size={UDim2.fromScale(0.155, 0.175)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					textSize={"AUTO"}
					text={"Cancel"}
					textColor={Color3.fromRGB(255, 255, 255)}
					maxTextSize={43}
					stroke={{
						ApplyStrokeMode: "Border",
						Thickness: 2,
						Color: Color3.fromRGB(255, 255, 255),
					}}
					cornerRadius={0.2}
					event={{
						MouseEnter: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_HOVERY_POSITION),
							});
						},
						MouseLeave: (button) => {
							Tools.TweenPlay(button, TI_BUTTON, {
								Position: UDim2.fromScale(button.Position.X.Scale, BUTTON_DEFAULTY_POSITION),
							});
						},
						Activated: () => {
							CloseAlert();
						},
					}}
				/>
			</CanvasGroup>
		</CanvasGroup>
	);
}
