/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { useScale } from "./SliceScale";

interface IImageButtonShadow extends React.InstanceProps<ImageButton> {
	AspectRatio?: number;
	ShadowTransparency?: number;
	ShadowAngle?: number;
	ShadowDistance?: number;
}

interface IImageLabelShadow extends React.InstanceProps<ImageLabel> {
	AspectRatio?: number;
	ShadowTransparency?: number;
	ShadowAngle?: number;
	ShadowDistance?: number;
}

interface ITextLabelShadow extends Partial<TextLabel> {
	MaxTextSize?: number;
	ShadowTransparency?: number;
	ShadowAngle?: number;
	ShadowDistance?: number;
}

function TextLabelShadow(props: ITextLabelShadow) {
	const parentRef = useRef<Frame>(undefined!);
	const [shadowPosition, setShadowPosition] = useState<UDim2 | undefined>(undefined);

	const shadowIndex = (props.ZIndex ?? 1) - 1;
	const shadowDistance = props.ShadowDistance ?? 0;

	const radians = math.rad(props.ShadowAngle ?? 0);
	const offsetX = shadowDistance * math.cos(radians);
	const offsetY = shadowDistance * math.sin(radians);

	const maxTextSize = useScale(props.MaxTextSize ?? 100);

	useEffect(() => {
		if (!parentRef.current) return;

		const UpdateShadowPosition = () =>
			setShadowPosition(
				Tools.OffsetToScale(parentRef.current.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)),
			);
		const connection = parentRef.current.GetPropertyChangedSignal("AbsoluteSize").Connect(UpdateShadowPosition);
		UpdateShadowPosition();

		return () => connection.Disconnect();
	}, [parentRef.current]);

	useEffect(() => {
		if (parentRef.current)
			setShadowPosition(
				Tools.OffsetToScale(parentRef.current.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)),
			);
	}, [props.Text]);

	return (
		<frame
			ref={parentRef}
			BackgroundTransparency={1}
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Size={props.Size}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				FontFace={props.FontFace}
				Text={props.Text}
				TextColor3={props.TextColor3}
				TextTransparency={props.TextTransparency}
				TextScaled={true}
				TextXAlignment={props.TextXAlignment}
				TextYAlignment={props.TextYAlignment}
				ZIndex={props.ZIndex}
			>
				<uitextsizeconstraint MaxTextSize={maxTextSize} />
			</textlabel>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={shadowPosition}
				Size={UDim2.fromScale(1, 1)}
				FontFace={props.FontFace}
				Text={props.Text}
				TextColor3={Color3.fromRGB(0, 0, 0)}
				TextTransparency={props.ShadowTransparency}
				TextScaled={true}
				TextXAlignment={props.TextXAlignment}
				TextYAlignment={props.TextYAlignment}
				ZIndex={shadowIndex}
			>
				<uitextsizeconstraint MaxTextSize={maxTextSize} />
			</textlabel>
		</frame>
	);
}

function ImageButtonShadow(props: IImageButtonShadow) {
	const parentRef = useRef<Frame>(undefined!);
	const [shadowPosition, setShadowPosition] = useState<UDim2 | undefined>(undefined);

	const shadowIndex = ((props.ZIndex as number) ?? 1) - 1;
	const shadowDistance = props.ShadowDistance ?? 0;

	const radians = math.rad(props.ShadowAngle ?? 0);
	const offsetX = shadowDistance * math.cos(radians);
	const offsetY = shadowDistance * math.sin(radians);

	useEffect(() => {
		if (!parentRef.current) return;

		const parent = parentRef.current;

		const UpdateShadowPosition = () =>
			setShadowPosition(Tools.OffsetToScale(parent.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)));
		const connection = parent.GetPropertyChangedSignal("AbsoluteSize").Connect(UpdateShadowPosition);
		UpdateShadowPosition();

		return () => connection.Disconnect();
	}, [parentRef.current]);

	return (
		<frame
			ref={parentRef}
			BackgroundTransparency={1}
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Size={props.Size}
		>
			{props.AspectRatio ? <uiaspectratioconstraint AspectRatio={props.AspectRatio} /> : undefined}
			<imagebutton
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				AutoButtonColor={false}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={props.Image}
				ImageColor3={props.ImageColor3}
				ZIndex={props.ZIndex}
				Event={props.Event}
			/>
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={shadowPosition}
				Size={UDim2.fromScale(1, 1)}
				Image={props.Image}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.ShadowTransparency}
				ZIndex={shadowIndex}
			/>
		</frame>
	);
}

function ImageLabelShadow(props: IImageLabelShadow) {
	const parentRef = useRef<Frame>(undefined!);
	const [shadowPosition, setShadowPosition] = useState<UDim2 | undefined>(undefined);

	const shadowIndex = ((props.ZIndex as number) ?? 1) - 1;
	const shadowDistance = props.ShadowDistance ?? 0;

	const radians = math.rad(props.ShadowAngle ?? 0);
	const offsetX = shadowDistance * math.cos(radians);
	const offsetY = shadowDistance * math.sin(radians);

	useEffect(() => {
		if (!parentRef.current) return;

		const parent = parentRef.current;

		const UpdateShadowPosition = () =>
			setShadowPosition(Tools.OffsetToScale(parent.AbsoluteSize, new UDim2(0.5, offsetX, 0.5, offsetY)));
		const connection = parent.GetPropertyChangedSignal("AbsoluteSize").Connect(UpdateShadowPosition);
		UpdateShadowPosition();

		return () => connection.Disconnect();
	}, [parentRef.current]);

	return (
		<frame
			ref={parentRef}
			BackgroundTransparency={1}
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Size={props.Size}
		>
			{props.AspectRatio ? <uiaspectratioconstraint AspectRatio={props.AspectRatio} /> : undefined}
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={props.Image}
				ImageColor3={props.ImageColor3}
				ZIndex={props.ZIndex}
			/>
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={shadowPosition}
				Size={UDim2.fromScale(1, 1)}
				Image={props.Image}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={props.ShadowTransparency}
				ZIndex={shadowIndex}
			/>
		</frame>
	);
}

export { ImageButtonShadow, ImageLabelShadow, TextLabelShadow };
