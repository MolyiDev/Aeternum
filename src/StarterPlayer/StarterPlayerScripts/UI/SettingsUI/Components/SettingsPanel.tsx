import React from "@rbxts/react";
import { forwardRef } from "@rbxts/react";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../../Components/SliceScale";

interface ISettingsPanel {
	Key?: string;
	Opacity?: number;
	VerticalFlex?: boolean;
}

export const UIPanel = forwardRef<CanvasGroup, ISettingsPanel>((props, ref) => {
	const scale = useScale(12);

	return (
		<canvasgroup
			key={props.Key}
			ref={ref}
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Top}
			Position={UDim2.fromScale(0.5, 0.02)}
			Size={UDim2.fromScale(0.6, 0.94)}
			GroupTransparency={props.Opacity ?? 1}
			Interactable={false}
		>
			<scrollingframe
				BackgroundTransparency={1}
				AutomaticCanvasSize={"XY"}
				AnchorPoint={AnchorPoints.Top}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.985, 0.88)}
				CanvasSize={UDim2.fromScale(0, 0)}
				BorderSizePixel={0}
				ScrollBarImageColor3={Color3.fromRGB(0, 0, 0)}
				ScrollBarThickness={scale}
				VerticalScrollBarInset={"ScrollBar"}
			>
				<uilistlayout
					Padding={new UDim(0.013, 0)}
					HorizontalAlignment={"Center"}
					SortOrder={"LayoutOrder"}
					VerticalFlex={props.VerticalFlex ? "SpaceBetween" : "None"}
				/>
				{props.children}
			</scrollingframe>
		</canvasgroup>
	);
});
