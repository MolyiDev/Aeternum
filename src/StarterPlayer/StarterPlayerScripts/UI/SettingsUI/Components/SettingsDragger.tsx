import { CanvasGroup, Frame, TextBox } from "@rbxts/better-react-components";
import { createColorSequence, GradientElement } from "@rbxts/better-react-components/out/helpers/Gradient";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { TextLabelShadow } from "../../Components/Shadows";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ISettingsDragger } from "./Interfaces/ISettingsDragger";

const TWINFO = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const HOVER_COLOR = Color3.fromRGB(66, 66, 66);
const DEFAULT_COLOR = Color3.fromRGB(77, 77, 77);

export function SettingsDragger(props: ISettingsDragger) {
	let isChangingText = false;
	let currentValue = props.initialValue;

	const textBoxRef = useRef<TextBox>(undefined!);
	const handleStrokeRef = useRef<UIStroke>(undefined!);
	const insideBarRef = useRef<Frame>(undefined!);
	const outsideBarRef = useRef<Frame>(undefined!);
	const frameBarRef = useRef<Frame>(undefined!);
	const handleRef = useRef<Frame>(undefined!);
	const [frameBoundUI, setFrameBoundUI] = useState<Frame | undefined>(undefined);

	function ChangeText(number: number) {
		if (currentValue === number) return;
		currentValue = number;
		const initialScaleX = math.clamp((number - props.minDrag) / (props.maxDrag - props.minDrag), 0, 1);
		handleRef.current.Position = UDim2.fromScale(initialScaleX, 0.5);
		props.ValueChanged(number);
	}

	function ChangePosition(inputPosition: Vector2) {
		const box = insideBarRef.current;

		const boxPosition = box.AbsolutePosition.X;
		const boxSize = box.AbsoluteSize.X;

		let scaleX = math.clamp((inputPosition.X - boxPosition) / boxSize, 0, 1);

		const number = math.floor(
			math.clamp(scaleX * (props.maxDrag - props.minDrag) + props.minDrag, props.minDrag, props.maxDrag),
		);

		const numberMultipler = math.round(number / props.dragAmount) * props.dragAmount;
		if (
			currentValue === numberMultipler ||
			math.abs(currentValue - (number / props.dragAmount) * props.dragAmount) < props.dragAmount * 0.95
		)
			return;
		scaleX = (numberMultipler - props.minDrag) / (props.maxDrag - props.minDrag);
		handleRef.current.Position = UDim2.fromScale(scaleX, 0.5);
		currentValue = numberMultipler;

		textBoxRef.current.Text = `${numberMultipler}${props.textModifier}`;
		props.ValueChanged(numberMultipler);
	}

	useEffect(() => {
		if (frameBarRef.current) setFrameBoundUI(frameBarRef.current);
		if (handleRef.current) {
			const initialScaleX = math.clamp((currentValue - props.minDrag) / (props.maxDrag - props.minDrag), 0, 1);
			handleRef.current.Position = UDim2.fromScale(initialScaleX, 0.5);
		}
		const textBox = textBoxRef.current;
		if (textBox) {
			const maxDigits = tostring(props.maxDrag).size();

			const connection = textBox.GetPropertyChangedSignal("Text").Connect(() => {
				if (isChangingText) {
					const stringNumber = textBox.Text.gsub("%D+", "")[0];

					const limitedNumber = stringNumber.sub(0, maxDigits);
					const number = tonumber(limitedNumber);

					if (number) textBox.Text = tostring(math.clamp(number, 0, props.maxDrag));
					else textBox.Text = limitedNumber;
				}
			});

			return () => connection.Disconnect();
		}
	}, [insideBarRef.current, frameBarRef.current, textBoxRef.current, handleRef.current]);

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

			<CanvasGroup
				name={"Drag"}
				noBackground
				anchorPoint={"mr"}
				position={UDim2.fromScale(1, 0.5)}
				size={UDim2.fromScale(0.52, 1)}
			>
				<Frame
					ref={outsideBarRef}
					name={"OutsideBar"}
					anchorPoint={"mr"}
					backgroundTransparency={0.35}
					background={Color3.fromRGB(65, 65, 65)}
					position={UDim2.fromScale(0.96, 0.5)}
					size={UDim2.fromScale(0.72, 0.3)}
					cornerRadius={0.25}
				>
					<Frame
						ref={frameBarRef}
						anchorPoint={"m"}
						name={"FrameBar"}
						noBackground
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(1, 0.9)}
					>
						<uidragdetector
							BoundingUI={frameBoundUI}
							DragStyle={"Scriptable"}
							ResponseStyle={"Scale"}
							Event={{
								DragStart: (dragger, inputPosition) => {
									Tools.TweenPlay(handleStrokeRef.current, TWINFO, {
										Thickness: 1.5,
									});
									ChangePosition(inputPosition);
								},

								DragEnd: () => {
									Tools.TweenPlay(handleStrokeRef.current, TWINFO, {
										Thickness: 0,
									});
								},

								DragContinue: (dragger, inputPosition) => ChangePosition(inputPosition),
							}}
						/>
					</Frame>
					<Frame
						ref={insideBarRef}
						name={"InsideBar"}
						anchorPoint={"m"}
						background={Color3.fromRGB(255, 255, 255)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.91, 0.35)}
						cornerRadius={0.5}
					>
						<Frame
							ref={handleRef}
							name={"Handle"}
							anchorPoint={"m"}
							background={Color3.fromRGB(152, 152, 152)}
							position={UDim2.fromScale(0, 0.5)}
							size={UDim2.fromScale(0.067, 1.866)}
							cornerRadius={1}
							stroke={{
								ref: handleStrokeRef,
								Color: Color3.fromRGB(152, 152, 152),
								Thickness: 0,
							}}
						/>
					</Frame>
				</Frame>
				<Frame
					name={"VolumeBox"}
					anchorPoint={"ml"}
					backgroundTransparency={0.35}
					background={DEFAULT_COLOR}
					position={UDim2.fromScale(0, 0.5)}
					size={UDim2.fromScale(0.215, 0.415)}
					cornerRadius={0.25}
				>
					<TextBox
						ref={textBoxRef}
						noBackground
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.9, 0.9)}
						font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						text={`${currentValue}${props.textModifier}`}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={"AUTO"}
						verticalTextAlign={"Top"}
						stroke={{ Thickness: 1 }}
						event={{
							FocusLost: (textBox) => {
								isChangingText = false;
								const number = math.clamp(
									tonumber(textBox.Text.gsub("%D+", "")[0]) ?? currentValue,
									props.minDrag,
									props.maxDrag,
								);
								textBox.Text = `${number}${props.textModifier}`;
								ChangeText(number);
							},
							Focused: (textBox) => (isChangingText = true),
							MouseEnter: (textBox) =>
								Tools.TweenPlay(textBox.Parent!, TWINFO, { BackgroundColor3: HOVER_COLOR }),
							MouseLeave: (textBox) =>
								Tools.TweenPlay(textBox.Parent!, TWINFO, { BackgroundColor3: DEFAULT_COLOR }),
						}}
					/>
				</Frame>
			</CanvasGroup>

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
