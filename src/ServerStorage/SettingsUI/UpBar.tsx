import Vide from "@rbxts/vide";
import { ImageButtonShadow, TextLabelShadow } from "ServerStorage/Components/Shadows";

export function UpBar() {
	return (
		<canvasgroup
			Name={"UpBar"}
			AnchorPoint={new Vector2(0, 0)}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0.15)}
		>
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
				FontFace={Font.fromId(12187372175, Enum.FontWeight.Regular)}
				Text={"Visuals"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextSize={1}
				TextStrokeTransparency={0}
				TextXAlignment={"Left"}
				ShadowDistance={0.0075}
			/>

			<frame
				Name={"Line"}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 0.78)}
				Size={UDim2.fromScale(1, 0.035)}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(167, 59, 73)),
							new ColorSequenceKeypoint(0.15, Color3.fromRGB(230, 230, 230)),
							new ColorSequenceKeypoint(0.85, Color3.fromRGB(230, 230, 230)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(167, 59, 73)),
						])
					}
				/>

				<uigridlayout
					CellPadding={new UDim2(0.049, 0, 0.048, 0)}
					CellSize={UDim2.fromScale(0.021, 7.061)}
					FillDirection={"Vertical"}
					HorizontalAlignment={"Center"}
					VerticalAlignment={"Center"}
				/>
				<imagelabel
					Name={"Audio"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Image={"rbxassetid://109254184865400"}
				/>
				<imagelabel
					Name={"Controls"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Image={"rbxassetid://109254184865400"}
				/>
				<imagelabel
					Name={"General"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Image={"rbxassetid://109254184865400"}
				/>
				<imagelabel
					Name={"Visual"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Image={"rbxassetid://109254184865400"}
				/>
			</frame>

			<frame
				Name={"Order"}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1, 0.75)}
			>
				<uigridlayout
					CellPadding={UDim2.fromScale(0.02, 0.02)}
					CellSize={UDim2.fromScale(0.05, 0.783)}
					FillDirectionMaxCells={4}
					HorizontalAlignment={"Center"}
					VerticalAlignment={"Center"}
				/>
				<canvasgroup
					Name={"Audio"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					LayoutOrder={4}
				>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.85, 0.85)}
						Image={"rbxassetid://72441646416779"}
					/>
				</canvasgroup>

				<canvasgroup
					Name={"Controls"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					LayoutOrder={3}
				>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Image={"rbxassetid://90196346676136"}
					/>
				</canvasgroup>

				<canvasgroup
					Name={"Visual"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					LayoutOrder={2}
				>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.75, 0.75)}
						Image={"rbxassetid://91690284827643"}
					/>
				</canvasgroup>

				<canvasgroup
					Name={"General"}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					LayoutOrder={1}
				>
					<ImageButtonShadow
						AnchorPoint={new Vector2(0.5, 0.5)}
						AutoButtonColor={false}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.7, 0.7)}
						Image={"rbxassetid://117575756600362"}
					/>
				</canvasgroup>
			</frame>
		</canvasgroup>
	);
}
