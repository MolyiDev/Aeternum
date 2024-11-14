/* eslint-disable prefer-const */
import { Frame, Image, ImageButton, Text } from "@rbxts/better-react-components";
import { BaseProps } from "@rbxts/better-react-components/out/helpers/BaseComponent";
import { ImageComponentProps } from "@rbxts/better-react-components/out/helpers/ImageComponent";
import { TextComponentProps } from "@rbxts/better-react-components/out/helpers/TextComponent";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

interface IImageButtonShadow extends BaseProps, ImageComponentProps<ImageButton> {
	shadowTransparency?: number;
	shadowAngle?: number;
	shadowDistance?: number;
}

interface ITextLabelShadow extends BaseProps, TextComponentProps<TextLabel> {
	shadowTransparency?: number;
	shadowAngle?: number;
	shadowDistance?: number;
}

function TextLabelShadow(props: ITextLabelShadow) {
	const parentRef = useRef<Frame>(undefined!);
	const [shadowPosition, setShadowPosition] = useState<UDim2 | undefined>(undefined);

	const shadowIndex = (props.zIndex ?? 1) - 1;
	const shadowDistance = props.shadowDistance ?? 0;

	const radians = math.rad(props.shadowAngle ?? 0);
	const offsetX = shadowDistance * math.cos(radians);
	const offsetY = shadowDistance * math.sin(radians);

	useEffect(() => {
		if (parentRef.current)
			setShadowPosition(
				Tools.OffsetToScale(parentRef.current.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)),
			);
	}, [parentRef.current, props.text]);

	return (
		<Frame
			name={props.name}
			ref={parentRef}
			noBackground
			anchorPoint={props.anchorPoint}
			position={props.position}
			size={props.size}
		>
			<Text
				name={"Principal"}
				noBackground
				anchorPoint={"m"}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
				font={props.font}
				text={props.text}
				textColor={props.textColor}
				textTransparency={props.textTransparency}
				textSize={"AUTO"}
				stroke={props.stroke}
				textAlign={props.textAlign}
				verticalTextAlign={props.verticalTextAlign}
				zIndex={props.zIndex}
			/>
			<Text
				name={"Shadow"}
				noBackground
				anchorPoint={"m"}
				position={shadowPosition}
				size={UDim2.fromScale(1, 1)}
				font={props.font}
				text={props.text}
				textColor={Color3.fromRGB(0, 0, 0)}
				textTransparency={props.shadowTransparency}
				textSize={"AUTO"}
				textAlign={props.textAlign}
				verticalTextAlign={props.verticalTextAlign}
				zIndex={shadowIndex}
			/>
		</Frame>
	);
}

function ImageButtonShadow(props: IImageButtonShadow) {
	const parentRef = useRef<Frame>(undefined!);
	const [shadowPosition, setShadowPosition] = useState<UDim2 | undefined>(undefined);

	const shadowIndex = (props.zIndex ?? 1) - 1;
	const shadowDistance = props.shadowDistance ?? 0;

	const radians = math.rad(props.shadowAngle ?? 0);
	const offsetX = shadowDistance * math.cos(radians);
	const offsetY = shadowDistance * math.sin(radians);

	useEffect(() => {
		if (parentRef.current)
			setShadowPosition(
				Tools.OffsetToScale(parentRef.current.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)),
			);
	}, [parentRef.current]);

	return (
		<Frame ref={parentRef} noBackground anchorPoint={props.anchorPoint} position={props.position} size={props.size}>
			<ImageButton
				noBackground
				anchorPoint={"m"}
				autoButtonColor={false}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
				image={props.image}
				imageColor={props.imageColor}
				zIndex={props.zIndex}
				event={props.imageEvent}
			/>
			<Image
				noBackground
				anchorPoint={"m"}
				position={shadowPosition}
				size={UDim2.fromScale(1, 1)}
				image={props.image}
				imageColor={Color3.fromRGB(0, 0, 0)}
				imageTransparency={props.shadowTransparency}
				zIndex={shadowIndex}
			/>
		</Frame>
	);
}

export { ImageButtonShadow, TextLabelShadow };
