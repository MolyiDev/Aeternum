import { CanvasGroup, Frame, Image } from "@rbxts/better-react-components";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<CanvasGroup
				anchorPoint={"mr"}
				noBackground
				position={UDim2.fromScale(1, 0.5)}
				size={UDim2.fromScale(0.425, 1)}
			>
				<Frame
					anchorPoint={"m"}
					background={Color3.fromRGB(16, 16, 16)}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(1, 1)}
					zIndex={0}
				/>
				<Frame
					background={Color3.fromRGB(53, 53, 53)}
					position={UDim2.fromScale(0.012, 0.008)}
					size={UDim2.fromScale(0.58, 0.67)}
					zIndex={1}
				>
					<Image
						noBackground
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
						image={"rbxassetid://71244050708131"}
						imageColor={Color3.fromRGB(24, 24, 24)}
						resampleMode={Enum.ResamplerMode.Pixelated}
					/>
				</Frame>
			</CanvasGroup>
		);
	},
);

export = story;
