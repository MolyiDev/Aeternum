import { CanvasGroup, Frame, ListLayout, ScrollingFrame } from "@rbxts/better-react-components";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { SettingsDragger } from "StarterPlayer/StarterPlayerScripts/UI/SettingsUI/Components/SettingsDragger";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<CanvasGroup
				noBackground
				anchorPoint={"m"}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(0.6, 0.9)}
				opacity={0}
				interactable={true}
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
					<ListLayout padding={0.0125} horizontalAlign={"Center"} flexAlignY={"None"} />
					<SettingsDragger
						title="Overall"
						explanation="Volume of all sounds"
						initialValue={0}
						minDrag={0}
						maxDrag={500}
						layoutOrder={0}
						dragAmount={20}
						textModifier="%"
						ValueChanged={(value) => print(value)}
					/>
				</ScrollingFrame>
			</CanvasGroup>
		);
	},
);

export = story;
