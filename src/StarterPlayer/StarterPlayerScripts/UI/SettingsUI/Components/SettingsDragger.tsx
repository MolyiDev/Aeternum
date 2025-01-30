import React, { useEffect, useRef, useState } from "@rbxts/react";
import { TextLabelShadow } from "../../Components/Shadows";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ISettingsDragger } from "./Interfaces/ISettingsDragger";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { useScale } from "../../Components/SliceScale";

const TWINFO = new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const HOVER_COLOR = Color3.fromRGB(45, 45, 45);
const DEFAULT_COLOR = Color3.fromRGB(60, 60, 60);

export function SettingsDragger(props: ISettingsDragger) {
	let Dragging = false;
	let isChangingText = false;
	let currentValue = props.InitialValue;

	const textBoxRef = useRef<TextBox>(undefined!);
	const handleStrokeRef = useRef<UIStroke>(undefined!);
	const insideBarRef = useRef<Frame>(undefined!);
	const outsideBarRef = useRef<Frame>(undefined!);
	const frameBarRef = useRef<Frame>(undefined!);
	const handleRef = useRef<Frame>(undefined!);
	const [frameBoundUI, setframeBoundUI] = useState<Frame | undefined>(undefined);

	const sliceScale = useScale(2);
	const borderScale = useScale(2);

	function ChangeText(number: number) {
		if (currentValue === number) return;
		currentValue = number;
		const initialScaleX = math.clamp((number - props.MinDrag) / (props.MaxDrag - props.MinDrag), 0, 1);
		handleRef.current.Position = UDim2.fromScale(initialScaleX, 0.5);
		props.ValueChanged(number);
	}

	function ChangePosition(inputPosition: Vector2) {
		const box = insideBarRef.current;

		const boxPosition = box.AbsolutePosition.X;
		const boxSize = box.AbsoluteSize.X;

		let scaleX = math.clamp((inputPosition.X - boxPosition) / boxSize, 0, 1);

		const number = math.floor(
			math.clamp(scaleX * (props.MaxDrag - props.MinDrag) + props.MinDrag, props.MinDrag, props.MaxDrag),
		);

		const stringMatch = tostring(tostring(props.DragAmount).match("%.(%d+)")?.[1]);
		const decimalPlaces = stringMatch ? math.min(stringMatch.size(), 2) : 2;

		let numberMultipler = math.clamp(
			math.floor((scaleX * (props.MaxDrag - props.MinDrag) + props.MinDrag) * (1 / props.DragAmount)) *
				props.DragAmount,
			props.MinDrag,
			props.MaxDrag,
		);

		// Formatear el número con hasta 2 decimales
		numberMultipler = tonumber(string.format(`%.${decimalPlaces}f`, numberMultipler)) ?? numberMultipler;

		if (
			currentValue === numberMultipler ||
			math.abs(currentValue - (number / props.DragAmount) * props.DragAmount) < props.DragAmount * 0.95
		)
			return;
		scaleX = (numberMultipler - props.MinDrag) / (props.MaxDrag - props.MinDrag);
		handleRef.current.Position = UDim2.fromScale(scaleX, 0.5);
		currentValue = numberMultipler;

		textBoxRef.current.Text = `${numberMultipler}${props.TextModifier}`;
		props.ValueChanged(numberMultipler);
	}

	useEffect(() => {
		if (frameBarRef.current) setframeBoundUI(frameBarRef.current);
		if (handleRef.current) {
			const initialScaleX = math.clamp((currentValue - props.MinDrag) / (props.MaxDrag - props.MinDrag), 0, 1);
			handleRef.current.Position = UDim2.fromScale(initialScaleX, 0.5);
		}
		const textBox = textBoxRef.current;
		if (textBox) {
			const maxDigits = props.TextMaxDigits ?? tostring(props.MaxDrag).size();

			const connection = textBox.GetPropertyChangedSignal("Text").Connect(() => {
				if (isChangingText) {
					const stringNumber = textBox.Text.gsub("[^%d.]", "")[0];

					const limitedNumber = stringNumber.sub(0, maxDigits);
					const number = tonumber(limitedNumber);

					print(number, limitedNumber);

					if (number) textBox.Text = tostring(math.clamp(number, 0, props.MaxDrag));
					else textBox.Text = limitedNumber;
				}
			});

			return () => connection.Disconnect();
		}
	}, [insideBarRef.current, frameBarRef.current, textBoxRef.current, handleRef.current]);

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

			<canvasgroup
				key={"Drag"}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.CenterRight}
				Position={UDim2.fromScale(1, 0.5)}
				Size={UDim2.fromScale(0.46, 1)}
			>
				<uiaspectratioconstraint AspectRatio={3.626} />
				<frame
					ref={outsideBarRef}
					key={"OutsideBar"}
					AnchorPoint={AnchorPoints.CenterRight}
					BackgroundTransparency={0.2}
					BackgroundColor3={Color3.fromRGB(60, 60, 60)}
					Position={UDim2.fromScale(0.96, 0.5)}
					Size={UDim2.fromScale(0.72, 0.3)}
				>
					<uicorner CornerRadius={new UDim(0.25)} />
					<frame
						ref={frameBarRef}
						key={"frameBar"}
						AnchorPoint={AnchorPoints.Center}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 0.9)}
					>
						<uidragdetector
							BoundingUI={frameBoundUI}
							DragStyle={"Scriptable"}
							ResponseStyle={"Scale"}
							Event={{
								DragStart: (dragger, inputPosition) => {
									Dragging = true;
									Tools.TweenPlay(handleStrokeRef.current, TWINFO, {
										Thickness: borderScale,
									});
									ChangePosition(inputPosition);
								},

								DragEnd: () => {
									Dragging = false;
									Tools.TweenPlay(handleStrokeRef.current, TWINFO, {
										Thickness: 0,
									});
								},

								DragContinue: (dragger, inputPosition) => ChangePosition(inputPosition),
							}}
						/>
					</frame>
					<frame
						ref={insideBarRef}
						key={"InsideBar"}
						AnchorPoint={AnchorPoints.Center}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.91, 0.35)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
						<frame
							ref={handleRef}
							key={"Handle"}
							AnchorPoint={AnchorPoints.Center}
							BackgroundColor3={Color3.fromRGB(100, 100, 100)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0.067, 1.866)}
						>
							<uicorner CornerRadius={new UDim(1)} />
							<uistroke
								ref={handleStrokeRef}
								Color={Color3.fromRGB(152, 152, 152)}
								Thickness={Dragging ? borderScale : 0}
							/>
						</frame>
					</frame>
				</frame>
				<frame
					key={"VolumeBox"}
					AnchorPoint={AnchorPoints.CenterLeft}
					BackgroundTransparency={0.2}
					BackgroundColor3={DEFAULT_COLOR}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(0.215, 0.415)}
				>
					<uicorner CornerRadius={new UDim(0.25)} />
					<textbox
						ref={textBoxRef}
						BackgroundTransparency={1}
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
						Text={`${currentValue}${props.TextModifier}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextYAlignment={"Center"}
						Event={{
							FocusLost: (textBox) => {
								isChangingText = false;
								const number = math.clamp(
									tonumber(textBox.Text.gsub("[^%d.]", "")[0]) ?? currentValue,
									props.MinDrag,
									props.MaxDrag,
								);
								textBox.Text = `${number}${props.TextModifier}`;
								ChangeText(number);
							},
							Focused: (textBox) => (isChangingText = true),
							MouseEnter: (textBox) =>
								Tools.TweenPlay(textBox.Parent!, TWINFO, { BackgroundColor3: HOVER_COLOR }),
							MouseLeave: (textBox) =>
								Tools.TweenPlay(textBox.Parent!, TWINFO, { BackgroundColor3: DEFAULT_COLOR }),
						}}
					/>
				</frame>
			</canvasgroup>

			<canvasgroup
				key={"Text"}
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
					TextScaled={true}
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
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					ShadowAngle={45}
					ShadowTransparency={0.55}
					ShadowDistance={5}
				/>
			</canvasgroup>
		</imagelabel>
	);
}
