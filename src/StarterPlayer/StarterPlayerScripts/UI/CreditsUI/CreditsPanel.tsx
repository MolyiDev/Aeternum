import React from "@rbxts/react";
import { TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../Components/SliceScale";

export interface ICreditsPanel {
	Name: string;
	Description: string;
	LayoutOrder: number;
}

export function CreditsPanel(props: ICreditsPanel) {
	const sliceScale = useScale(2);

	return (
		<imagelabel
			AnchorPoint={AnchorPoints.Center}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.96, 0.15)}
			LayoutOrder={props.LayoutOrder}
			Image={"rbxassetid://71973861757110"}
			ImageColor3={Color3.fromRGB(47, 47, 47)}
			ImageTransparency={0.2}
			ResampleMode={"Pixelated"}
			ScaleType={"Slice"}
			SliceCenter={new Rect(new Vector2(10, 10), new Vector2(38, 38))}
			SliceScale={sliceScale}
		>
			<uigradient Color={new ColorSequence(Color3.fromRGB(34, 34, 34), Color3.fromRGB(53, 53, 53))} />

			<TextLabelShadow
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.965, 0.7)}
				FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
				Text={`${props.Name} - ${props.Description}`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Center}
				MaxTextSize={82}
				ShadowAngle={45}
				ShadowTransparency={0.55}
				ShadowDistance={5}
			/>
		</imagelabel>
	);
}
