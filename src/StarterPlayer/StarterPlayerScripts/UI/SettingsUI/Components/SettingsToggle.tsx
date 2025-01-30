import { ISettingsToggle } from "./Interfaces/ISettingsToggle";
import React, { useRef } from "@rbxts/react";
import { TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../../Components/SliceScale";

const TWINFO_KNOB = new TweenInfo(0.325, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWINFO_TOGGLE = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const HOVER_COLOR = Color3.fromRGB(200, 200, 200);
const DEFAULT_COLOR = Color3.fromRGB(255, 255, 255);

const KNOB_ON_COLOR = Color3.fromRGB(0, 255, 136);
const KNOB_ON_POSITION = UDim2.fromScale(0.765, 0.5);

const KNOB_OFF_COLOR = Color3.fromRGB(145, 0, 2);
const KNOB_OFF_POSITION = UDim2.fromScale(0.235, 0.5);

export function SettingsToggle(props: ISettingsToggle) {
	let Activated = props.InitialValue;

	const Knob = useRef<Frame>(undefined!);
	const sliceScale = useScale(2);

	const InitialColor = Activated ? KNOB_ON_COLOR : KNOB_OFF_COLOR;
	const InitialPosition = Activated ? KNOB_ON_POSITION : KNOB_OFF_POSITION;

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

			<imagebutton
				AnchorPoint={AnchorPoints.CenterRight}
				AutoButtonColor={false}
				BackgroundTransparency={0.2}
				BackgroundColor3={DEFAULT_COLOR}
				Position={UDim2.fromScale(0.975, 0.5)}
				Size={UDim2.fromScale(0.19, 0.658)}
				ImageTransparency={1}
				Event={{
					MouseEnter: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: HOVER_COLOR }),
					MouseLeave: (butt) => Tools.TweenPlay(butt, TWINFO_TOGGLE, { BackgroundColor3: DEFAULT_COLOR }),
					Activated: () => {
						Activated = !Activated;
						if (Activated)
							Tools.TweenPlay(Knob.current, TWINFO_KNOB, {
								Position: KNOB_ON_POSITION,
								BackgroundColor3: KNOB_ON_COLOR,
							});
						else
							Tools.TweenPlay(Knob.current, TWINFO_KNOB, {
								Position: KNOB_OFF_POSITION,
								BackgroundColor3: KNOB_OFF_COLOR,
							});

						props.ToggleChanged(Activated);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2.339} />
				<uigradient Color={new ColorSequence(Color3.fromRGB(65, 65, 65), Color3.fromRGB(100, 100, 100))} />
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<frame
					ref={Knob}
					AnchorPoint={AnchorPoints.Center}
					BackgroundColor3={InitialColor}
					Position={InitialPosition}
					Size={UDim2.fromScale(0.343, 0.8)}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
				</frame>
			</imagebutton>

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
