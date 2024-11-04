/* eslint-disable prefer-const */
import Vide from "@rbxts/vide";

interface IImageButtonShadow extends Vide.InstanceAttributes<ImageButton> {
	ShadowTransparency?: number;
	ShadowAngle?: number;
	ShadowDistance?: number;
}

interface ITextLabelShadow extends Vide.InstanceAttributes<TextLabel> {
	ShadowTransparency?: number;
	ShadowAngle?: number;
	ShadowDistance?: number;
}

function TextLabelShadow({
	ShadowTransparency = 0.6,
	ShadowAngle = 45,
	ShadowDistance = 0.0115,
	AnchorPoint,
	BackgroundTransparency,
	Position,
	Size,
	FontFace,
	Text,
	TextColor3,
	TextScaled,
	TextSize,
	TextStrokeTransparency,
	TextXAlignment,
	ZIndex,
}: ITextLabelShadow) {
	const positionValue = typeIs(Position, "function") ? Position() : Position;
	const ShadowIndex = (typeIs(ZIndex, "function") ? ZIndex() : (ZIndex ?? 1)) - 1;

	const radians = math.rad(ShadowAngle);
	const offsetX = ShadowDistance * math.cos(radians);
	const offsetY = ShadowDistance * math.sin(radians);

	const ShadowPosition = positionValue
		? positionValue.add(new UDim2(offsetX, 0, offsetY * 10, 0))
		: new UDim2(0, 0, 0, 0);

	return (
		<>
			<textlabel
				AnchorPoint={AnchorPoint}
				BackgroundTransparency={BackgroundTransparency}
				Position={Position}
				Size={Size}
				FontFace={FontFace}
				Text={Text}
				TextColor3={TextColor3}
				TextScaled={TextScaled}
				TextSize={TextSize}
				TextStrokeTransparency={TextStrokeTransparency}
				TextXAlignment={TextXAlignment}
				ZIndex={ZIndex}
			/>
			<textlabel
				Name={"Shadow"}
				Position={ShadowPosition}
				TextColor3={Color3.fromRGB(0, 0, 0)}
				TextStrokeTransparency={1}
				TextTransparency={ShadowTransparency}
				ZIndex={ShadowIndex}
				AnchorPoint={AnchorPoint}
				BackgroundTransparency={BackgroundTransparency}
				Size={Size}
				FontFace={FontFace}
				Text={Text}
				TextScaled={TextScaled}
				TextSize={TextSize}
				TextXAlignment={TextXAlignment}
			/>
		</>
	);
}

function ImageButtonShadow(props: IImageButtonShadow) {
	const {
		AnchorPoint,
		BackgroundTransparency,
		Size,
		Image,
		ZIndex,
		Position,
		ShadowTransparency = 0.4,
		ShadowAngle = 45,
		ShadowDistance = 0.09,
	} = props;

	const positionValue = typeIs(Position, "function") ? Position() : Position;
	const ShadowIndex = (typeIs(ZIndex, "function") ? ZIndex() : (ZIndex ?? 1)) - 1;

	const radians = math.rad(ShadowAngle);
	const offsetX = ShadowDistance * math.cos(radians);
	const offsetY = ShadowDistance * math.sin(radians);

	const ShadowPosition = positionValue ? positionValue.add(new UDim2(offsetX, 0, offsetY, 0)) : new UDim2(0, 0, 0, 0);

	return (
		<>
			<imagebutton {...props} />
			<imagelabel
				Name={"Shadow"}
				AnchorPoint={AnchorPoint}
				BackgroundTransparency={BackgroundTransparency}
				Position={ShadowPosition}
				Size={Size}
				Image={Image}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={ShadowTransparency}
				ZIndex={ShadowIndex}
			/>
		</>
	);
}

export { ImageButtonShadow, TextLabelShadow };
