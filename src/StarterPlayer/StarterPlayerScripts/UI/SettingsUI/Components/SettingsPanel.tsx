import { CanvasGroup, ListLayout, ScrollingFrame } from "@rbxts/better-react-components";
import React from "@rbxts/react";
import { forwardRef } from "@rbxts/react";

interface ISettingsPanel {
	name: string;
	flexAlign?: boolean;
}

export const SettingsPanel = forwardRef<CanvasGroup, ISettingsPanel>((props, ref) => {
	return (
		<CanvasGroup
			name={props.name}
			ref={ref}
			noBackground
			anchorPoint={"m"}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(0.6, 0.9)}
			opacity={1}
			interactable={false}
		>
			<ScrollingFrame
				noBackground
				automaticCanvasSize={"XY"}
				anchorPoint={"t"}
				position={UDim2.fromScale(0.5, 0)}
				size={UDim2.fromScale(1, 0.875)}
				canvasSize={UDim2.fromScale(0, 0)}
				scrollbar={{
					imageColor: Color3.fromRGB(167, 59, 73),
					thickness: 8,
				}}
				scrollbarInsetV={"ScrollBar"}
			>
				<ListLayout
					padding={0.0125}
					horizontalAlign={"Center"}
					order={"LayoutOrder"}
					flexAlignY={props.flexAlign ? "SpaceBetween" : "None"}
				/>
				{props.children}
			</ScrollingFrame>
		</CanvasGroup>
	);
});
