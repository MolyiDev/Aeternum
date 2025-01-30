import React, { useRef } from "@rbxts/react";
import { TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { ISettingsDecision } from "./Interfaces/ISettingsDecision";
import { EDecision } from "../../../../../ReplicatedStorage/Enums/UI/EDecision";
import { useScale } from "../../Components/SliceScale";

const TWINFO_TOGGLE = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const HOVER_COLOR = Color3.fromRGB(200, 200, 200);
const DEFAULT_COLOR = Color3.fromRGB(255, 255, 255);

export function SettingsDecision(props: ISettingsDecision) {
	let CurrentDecision = props.InitialValue;

	const OptionOneStroke = useRef<UIStroke>(undefined!);
	const OptionTwoStroke = useRef<UIStroke>(undefined!);
	const OptionThreeStroke = useRef<UIStroke>(undefined!);

	const sliceScale = useScale(2);
	const strokeScale = useScale(3.5);

	const Size = props.OptionThree ? 0.49 : 0.49;

	return (
		<imagelabel
			AnchorPoint={AnchorPoints.Center}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.96, 0.175)}
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

			<frame
				AnchorPoint={AnchorPoints.CenterRight}
				BackgroundTransparency={0.2}
				BackgroundColor3={Color3.fromRGB(70, 70, 70)}
				Position={UDim2.fromScale(0.975, 0.5)}
				Size={UDim2.fromScale(0.35, 0.658)}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />

				<imagebutton
					AnchorPoint={AnchorPoints.CenterLeft}
					AutoButtonColor={false}
					BackgroundTransparency={0.2}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(Size, 1)}
					Event={{
						MouseEnter: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: HOVER_COLOR }),
						MouseLeave: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: DEFAULT_COLOR }),
						Activated: () => {
							switch (CurrentDecision) {
								case EDecision.One:
									return;
								case EDecision.Two:
									Tools.TweenPlay(OptionTwoStroke.current, TWINFO_TOGGLE, { Thickness: 0 });
									break;
								case EDecision.Three:
									Tools.TweenPlay(OptionThreeStroke.current, TWINFO_TOGGLE, { Thickness: 0 });
									break;
							}

							CurrentDecision = EDecision.One;
							Tools.TweenPlay(OptionOneStroke.current, TWINFO_TOGGLE, { Thickness: strokeScale });
							props.DecisionChanged(CurrentDecision);
						},
					}}
				>
					<uistroke
						ref={OptionOneStroke}
						Color={Color3.fromRGB(255, 255, 255)}
						Thickness={CurrentDecision === EDecision.One ? strokeScale : 0}
						Transparency={0.2}
					/>
					<uigradient Color={new ColorSequence(Color3.fromRGB(65, 65, 65), Color3.fromRGB(100, 100, 100))} />
					<uicorner CornerRadius={new UDim(0.15, 0)} />

					<TextLabelShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						Text={props.OptionOne}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Center}
						MaxTextSize={75}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
					/>
				</imagebutton>

				<imagebutton
					AnchorPoint={AnchorPoints.CenterRight}
					AutoButtonColor={false}
					BackgroundTransparency={0.2}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					Position={UDim2.fromScale(1, 0.5)}
					Size={UDim2.fromScale(Size, 1)}
					Event={{
						MouseEnter: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: HOVER_COLOR }),
						MouseLeave: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: DEFAULT_COLOR }),
						Activated: () => {
							switch (CurrentDecision) {
								case EDecision.One:
									Tools.TweenPlay(OptionOneStroke.current, TWINFO_TOGGLE, { Thickness: 0 });
									break;
								case EDecision.Two:
									return;
								case EDecision.Three:
									Tools.TweenPlay(OptionThreeStroke.current, TWINFO_TOGGLE, { Thickness: 0 });
									break;
							}

							CurrentDecision = EDecision.Two;
							Tools.TweenPlay(OptionTwoStroke.current, TWINFO_TOGGLE, { Thickness: strokeScale });
							props.DecisionChanged(CurrentDecision);
						},
					}}
				>
					<uistroke
						ref={OptionTwoStroke}
						Color={Color3.fromRGB(255, 255, 255)}
						Thickness={CurrentDecision === EDecision.Two ? strokeScale : 0}
						Transparency={0.2}
					/>
					<uigradient Color={new ColorSequence(Color3.fromRGB(65, 65, 65), Color3.fromRGB(100, 100, 100))} />
					<uicorner CornerRadius={new UDim(0.15, 0)} />

					<TextLabelShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						Text={props.OptionTwo}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Center}
						MaxTextSize={75}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
					/>
				</imagebutton>
			</frame>

			<canvasgroup
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.CenterLeft}
				Position={UDim2.fromScale(0.024, 0.5)}
				Size={UDim2.fromScale(0.485, 0.95)}
			>
				<TextLabelShadow
					AnchorPoint={AnchorPoints.Top}
					Position={UDim2.fromScale(0.5, 0.1)}
					Size={UDim2.fromScale(1, 0.5)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					Text={props.Title}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
					ShadowAngle={45}
					ShadowTransparency={0.55}
					ShadowDistance={5}
				/>
				<TextLabelShadow
					AnchorPoint={AnchorPoints.Bottom}
					Position={UDim2.fromScale(0.5, 0.86)}
					Size={UDim2.fromScale(1, 0.3)}
					FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					Text={props.Explanation}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextTransparency={0.2}
					TextXAlignment={Enum.TextXAlignment.Left}
					ShadowAngle={45}
					ShadowTransparency={0.55}
					ShadowDistance={5}
				/>
			</canvasgroup>
		</imagelabel>
	);
}
