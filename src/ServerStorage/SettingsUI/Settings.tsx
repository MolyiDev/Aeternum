import { CanvasGroup } from "@rbxts/better-react-components";
import React from "@rbxts/react";
import { SpecialButton } from "ServerStorage/Components/SpecialButton";

export function Settings() {
	return (
		<CanvasGroup
			noBackground
			anchorPoint={"m"}
			position={UDim2.fromScale(0.5, 0.558)}
			size={UDim2.fromScale(1, 0.883)}
		>
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
			/>
		</CanvasGroup>
	);
}
