import { CreateReactStory } from "@rbxts/ui-labs";
import { UpBar } from "./UpBar";
import React from "@rbxts/react";
import { AnchorPoints, CanvasGroup, Frame } from "@rbxts/better-react-components";
import {
	createColorSequence,
	createNumberSequence,
	GradientElement,
} from "@rbxts/better-react-components/out/helpers/Gradient";
import ReactRoblox from "@rbxts/react-roblox";
import { Settings } from "./Settings";

function UI() {
	return (
		<CanvasGroup
			noBackground
			anchorPoint={AnchorPoints.Middle}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
		>
			<Frame
				backgroundTransparency={0.1}
				anchorPoint={AnchorPoints.Middle}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
			>
				<GradientElement
					color={createColorSequence([Color3.fromRGB(22, 22, 22), Color3.fromRGB(49, 49, 49)])}
					rotation={90}
				/>
			</Frame>

			<Frame
				anchorPoint={AnchorPoints.Top}
				position={UDim2.fromScale(0.5, 0.002)}
				size={UDim2.fromScale(1, 0.225)}
			>
				<GradientElement
					color={createColorSequence([Color3.fromRGB(0, 0, 0), Color3.fromRGB(26, 26, 26)])}
					rotation={90}
					transparency={createNumberSequence([
						new NumberSequenceKeypoint(0, 0.3, 0),
						new NumberSequenceKeypoint(0.535, 0.475, 0),
						new NumberSequenceKeypoint(1, 1, 1),
					])}
				/>
			</Frame>

			<UpBar />
			<Settings />
		</CanvasGroup>
	);
}

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return UI();
	},
);

export = story;
