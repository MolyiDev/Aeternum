import { CanvasGroup, Frame, ImageButton } from "@rbxts/better-react-components";
import { ISettingsToggle } from "./Interfaces/ISettingsToggle";
import React, { useRef } from "@rbxts/react";
import { createColorSequence, GradientElement } from "@rbxts/better-react-components/out/helpers/Gradient";
import { TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const TWINFO_KNOB = new TweenInfo(0.325, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWINFO_TOGGLE = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const HOVER_COLOR = Color3.fromRGB(66, 66, 66);
const DEFAULT_COLOR = Color3.fromRGB(77, 77, 77);

const KNOB_ON_COLOR = Color3.fromRGB(0, 255, 136);
const KNOB_ON_POSITION = UDim2.fromScale(0.765, 0.5);

const KNOB_OFF_COLOR = Color3.fromRGB(145, 0, 2);
const KNOB_OFF_POSITION = UDim2.fromScale(0.235, 0.5);

export function SettingsToggle(props: ISettingsToggle) {
	let Activated = props.initialValue;

	const Knob = useRef<Frame>(undefined!);

	const InitialColor = Activated ? KNOB_ON_COLOR : KNOB_OFF_COLOR;
	const InitialPosition = Activated ? KNOB_ON_POSITION : KNOB_OFF_POSITION;

	return (
		<Frame
			anchorPoint={"m"}
			backgroundTransparency={0.25}
			size={UDim2.fromScale(0.96, 0.175)}
			cornerRadius={0.1}
			layoutOrder={props.layoutOrder}
		>
			<GradientElement
				color={createColorSequence([
					new ColorSequenceKeypoint(0, Color3.fromRGB(34, 34, 34)),
					new ColorSequenceKeypoint(1, Color3.fromRGB(53, 53, 53)),
				])}
			/>

			<ImageButton
				anchorPoint={"mr"}
				autoButtonColor={false}
				background={DEFAULT_COLOR}
				position={UDim2.fromScale(0.98, 0.5)}
				size={UDim2.fromScale(0.2, 0.75)}
				imageTransparency={1}
				cornerRadius={0.15}
				event={{
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
				<Frame
					ref={Knob}
					anchorPoint={"m"}
					background={InitialColor}
					position={InitialPosition}
					size={UDim2.fromScale(0.35, 0.8)}
					cornerRadius={0.15}
				/>
			</ImageButton>

			<CanvasGroup
				name={"Text"}
				noBackground
				anchorPoint={"ml"}
				position={UDim2.fromScale(0.02, 0.5)}
				size={UDim2.fromScale(0.45, 1)}
			>
				<TextLabelShadow
					name={"Title"}
					anchorPoint={"t"}
					position={UDim2.fromScale(0.5, 0.1)}
					size={UDim2.fromScale(1, 0.5)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					text={props.title}
					textColor={Color3.fromRGB(255, 255, 255)}
					textSize={"AUTO"}
					textAlign={Enum.TextXAlignment.Left}
					shadowAngle={45}
					shadowTransparency={0.55}
					shadowDistance={5}
				/>
				<TextLabelShadow
					name={"Explanation"}
					anchorPoint={"b"}
					position={UDim2.fromScale(0.5, 0.86)}
					size={UDim2.fromScale(1, 0.3)}
					font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
					text={props.explanation}
					textColor={Color3.fromRGB(255, 255, 255)}
					textTransparency={0.2}
					textSize={"AUTO"}
					textAlign={Enum.TextXAlignment.Left}
					shadowAngle={45}
					shadowTransparency={0.55}
					shadowDistance={5}
				/>
			</CanvasGroup>
		</Frame>
	);
}
