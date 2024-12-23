import { Frame } from "@rbxts/better-react-components";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { ConfirmAlert } from "../Components/ConfirmAlert";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<>
				<Frame
					anchorPoint={"m"}
					background={Color3.fromRGB(20, 20, 20)}
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
				/>
				<ConfirmAlert
					title="Are you absolutely sure?"
					description="This action is an example, this action is an example. This action is an example."
					type={"Red"}
				/>
			</>
		);
		/*return (
			<>
				<Frame
					anchorPoint={"m"}
					background={Color3.fromRGB(20, 20, 20)}
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
				/>
				<Image
					noBackground
					anchorPoint={"m"}
					size={UDim2.fromScale(1.8, 1.8)}
					position={UDim2.fromScale(0.5, 0.5)}
					image={"rbxassetid://125570236139912"}
					imageColor={Color3.fromRGB(50, 15, 20)}
				></Image>
				<Frame
					anchorPoint={"m"}
					size={UDim2.fromScale(0.45, 0.325)}
					position={UDim2.fromScale(0.5, 0.5)}
					cornerRadius={0.05}
					background={createColorSequence([Color3.fromRGB(43, 12, 10), Color3.fromRGB(11, 10, 15)])}
					gradientRotation={90}
				>
					<Text
						noBackground
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.195)}
						size={UDim2.fromScale(0.9, 0.195)}
						font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						textSize={"AUTO"}
						text={"Are you absolutely sure?"}
						textColor={Color3.fromRGB(192, 176, 175)}
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
						text={"This action is an example, this action is an example. This action is an example."}
						textColor={Color3.fromRGB(192, 176, 175)}
						textAlign={"Left"}
						verticalTextAlign={"Top"}
						maxTextSize={40}
					/>
					<TextButton
						background={Color3.fromRGB(255, 255, 255)}
						anchorPoint={"br"}
						autoButtonColor={false}
						position={UDim2.fromScale(0.965, 0.9145)}
						size={UDim2.fromScale(0.185, 0.175)}
						font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						textSize={"AUTO"}
						text={"Continue"}
						textColor={Color3.fromRGB(0, 0, 0)}
						maxTextSize={43}
						cornerRadius={0.2}
					/>
					<TextButton
						noBackground
						anchorPoint={"br"}
						autoButtonColor={false}
						position={UDim2.fromScale(0.765, 0.9145)}
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
					/>
				</Frame>
			</>
		);*/
	},
);

export = story;
