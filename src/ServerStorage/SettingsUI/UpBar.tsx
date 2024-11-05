import { AnchorPoints, CanvasGroup, Frame, GridLayout, Image } from "@rbxts/better-react-components";
import { createColorSequence, GradientElement } from "@rbxts/better-react-components/out/helpers/Gradient";
import React from "@rbxts/react";
import { ImageButtonShadow, TextLabelShadow } from "ServerStorage/Components/Shadows";

export function UpBar() {
	return (
		<CanvasGroup noBackground size={UDim2.fromScale(1, 0.15)}>
			<ImageButtonShadow
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.992, 0.37)}
				Size={UDim2.fromScale(0.042, 0.496)}
				Image={"rbxassetid://107893206131443"}
			/>

			<TextLabelShadow
				AnchorPoint={new Vector2(0, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.0125, 0.11)}
				Size={UDim2.fromScale(0.24, 0.55)}
				FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
				Text={"Visuals"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextSize={1}
				TextStrokeTransparency={0}
				TextXAlignment={"Left"}
				ShadowDistance={0.0075}
			/>

			<Frame
				anchorPoint={AnchorPoints.Bottom}
				position={UDim2.fromScale(0.5, 0.78)}
				size={UDim2.fromScale(1, 0.035)}
			>
				<GradientElement
					color={createColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(167, 59, 73)),
						new ColorSequenceKeypoint(0.15, Color3.fromRGB(230, 230, 230)),
						new ColorSequenceKeypoint(0.85, Color3.fromRGB(230, 230, 230)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(167, 59, 73)),
					])}
				/>

				<GridLayout
					cellPadding={new UDim2(0.049, 0, 0.048, 0)}
					cellSize={UDim2.fromScale(0.021, 7.061)}
					direction={"Vertical"}
					horizontalAlign={"Center"}
					verticalAlign={"Center"}
				/>

				<Image
					/* Audio */
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
				/>

				<Image
					/* Controls */
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
				/>

				<Image
					/* General */
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
				/>

				<Image
					/* Visual */
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
				/>
			</Frame>

			<Frame
				noBackground
				anchorPoint={AnchorPoints.Top}
				position={UDim2.fromScale(0.5, 0)}
				size={UDim2.fromScale(1, 0.75)}
			>
				<GridLayout
					cellPadding={UDim2.fromScale(0.02, 0.02)}
					cellSize={UDim2.fromScale(0.05, 0.783)}
					horizontalAlign={"Center"}
					verticalAlign={"Center"}
				/>
				<CanvasGroup /* Audio */ noBackground anchorPoint={AnchorPoints.Middle} layoutOrder={4}>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.85, 0.85)}
						Image={"rbxassetid://72441646416779"}
					/>
				</CanvasGroup>

				<CanvasGroup /* Controls */ noBackground anchorPoint={AnchorPoints.Middle} layoutOrder={3}>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Image={"rbxassetid://90196346676136"}
					/>
				</CanvasGroup>

				<CanvasGroup /* Visual */ noBackground anchorPoint={AnchorPoints.Middle} layoutOrder={2}>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.75, 0.75)}
						Image={"rbxassetid://91690284827643"}
					/>
				</CanvasGroup>

				<CanvasGroup /* General */ noBackground anchorPoint={AnchorPoints.Middle} layoutOrder={1}>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.7, 0.7)}
						Image={"rbxassetid://117575756600362"}
					/>
				</CanvasGroup>
			</Frame>
		</CanvasGroup>
	);
}
