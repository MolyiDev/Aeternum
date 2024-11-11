/* eslint-disable roblox-ts/lua-truthiness */
import { Frame, ImageButton, Text, CanvasGroup, Image, ColorOrHex } from "@rbxts/better-react-components";
import { BaseProps } from "@rbxts/better-react-components/out/helpers/BaseComponent";
import { Gradient } from "@rbxts/better-react-components/out/helpers/Gradient";
import { ImageComponentProps } from "@rbxts/better-react-components/out/helpers/ImageComponent";
import { TextComponentProps } from "@rbxts/better-react-components/out/helpers/TextComponent";
import Object from "@rbxts/object-utils";
import { getBindingValue } from "@rbxts/pretty-react-hooks";
import React, { InstanceEvent, useEffect, useRef, useState } from "@rbxts/react";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

interface ISpecialButton extends BaseProps, TextComponentProps<TextLabel>, ImageComponentProps<ImageButton> {
	buttonColor?: ColorOrHex | Gradient | React.Binding<ColorOrHex | Gradient>;
	insideButtonColor?: ColorOrHex | Gradient | React.Binding<ColorOrHex | Gradient>;
	buttonStrokeColor?: Color3 | React.Binding<Color3>;
}

const TWEENINFO = new TweenInfo(0.375, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWEENINFO_CLICK = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

export function SpecialButton(props: ISpecialButton) {
	const strokeRef = useRef<UIStroke>(undefined!);
	const glowRef = useRef<Frame>(undefined!);
	const shineRef = useRef<ImageLabel>(undefined!);
	const buttonRef = useRef<ImageButton>(undefined!);
	const parentRef = useRef<Frame>(undefined!);
	const [glowSize, setGlowSize] = useState<UDim2 | undefined>(undefined);

	const STROKE_DEFAULT = getBindingValue(props.buttonStrokeColor);
	const STROKE_ENTER = STROKE_DEFAULT && Tools.LightenColor(STROKE_DEFAULT, 0.15);
	const STROKE_CLICK = STROKE_DEFAULT && Tools.LightenColor(STROKE_DEFAULT, 0.3);

	const BUTTON_DEFAULT_SIZE = props.size ?? new UDim2();
	const BUTTON_CLICK_SIZE = UDim2.fromScale(BUTTON_DEFAULT_SIZE.X.Scale - 0.01, BUTTON_DEFAULT_SIZE.Y.Scale - 0.015);

	const SHINE_DEFAULT_SIZE = UDim2.fromScale(0.715, 3.333);
	const SHINE_CLICK_SIZE = UDim2.fromScale(SHINE_DEFAULT_SIZE.X.Scale * 1.45, SHINE_DEFAULT_SIZE.Y.Scale);

	useEffect(() => {
		if (parentRef.current)
			setGlowSize(
				Tools.OffsetToScale(
					parentRef.current.AbsoluteSize,
					new UDim2(BUTTON_DEFAULT_SIZE.X.Scale, 20, BUTTON_DEFAULT_SIZE.Y.Scale, 20),
				),
			);
	}, [parentRef.current]);

	const combinedEvents: InstanceEvent<ImageButton> = {
		MouseButton1Down: (butt, x, y) => {
			Tools.TweenPlay(butt, TWEENINFO_CLICK, { Size: BUTTON_CLICK_SIZE });
			Tools.TweenPlay(shineRef.current, TWEENINFO_CLICK, { Size: SHINE_CLICK_SIZE });
			Tools.TweenPlay(glowRef.current, TWEENINFO_CLICK, {
				Size: glowSize && UDim2.fromScale(glowSize.X.Scale - 0.01, glowSize.Y.Scale - 0.015),
			});
			Tools.TweenPlay(strokeRef.current, TWEENINFO_CLICK, { Color: STROKE_CLICK });
		},

		MouseButton1Up: (butt, x, y) => {
			Tools.TweenPlay(butt, TWEENINFO_CLICK, { Size: BUTTON_DEFAULT_SIZE });
			Tools.TweenPlay(shineRef.current, TWEENINFO_CLICK, { Size: SHINE_DEFAULT_SIZE });
			Tools.TweenPlay(glowRef.current, TWEENINFO_CLICK, { Size: glowSize });
			Tools.TweenPlay(strokeRef.current, TWEENINFO_CLICK, { Color: STROKE_ENTER });
		},

		MouseEnter: () => {
			Tools.TweenPlay(shineRef.current, TWEENINFO, { ImageTransparency: 0.55 });
			Tools.TweenPlay(glowRef.current, TWEENINFO, { Transparency: 0.95 });
			Tools.TweenPlay(strokeRef.current, TWEENINFO, { Color: STROKE_ENTER });
		},

		MouseLeave: (butt) => {
			Tools.TweenPlay(shineRef.current, TWEENINFO, { Size: SHINE_DEFAULT_SIZE });
			Tools.TweenPlay(shineRef.current, TWEENINFO_CLICK, { ImageTransparency: 1 });
			Tools.TweenPlay(glowRef.current, TWEENINFO, { Transparency: 1 });
			Tools.TweenPlay(glowRef.current, TWEENINFO_CLICK, { Size: glowSize });
			Tools.TweenPlay(strokeRef.current, TWEENINFO, { Color: STROKE_DEFAULT });
			Tools.TweenPlay(butt, TWEENINFO_CLICK, { Size: BUTTON_DEFAULT_SIZE });
		},

		MouseMoved: (butt, x, y) => {
			const buttonAbsolutePosition = butt.AbsolutePosition;
			const buttonAbsoluteSize = butt.AbsoluteSize;

			let relativeMouseX = (x - buttonAbsolutePosition.X) / buttonAbsoluteSize.X;
			relativeMouseX = math.clamp(relativeMouseX, 0, 1);

			shineRef.current.Position = new UDim2(relativeMouseX, 0, 0.5, 0);
		},
	};

	Object.entries(props.imageEvent ?? {}).forEach(([eventName, customHandler]) => {
		const defaultHandler = combinedEvents[eventName as keyof InstanceEvent<ImageButton>];
		combinedEvents[eventName as keyof InstanceEvent<ImageButton>] = (...args) => {
			(defaultHandler as (...args: unknown[]) => void)?.(...args);
			(customHandler as (...args: unknown[]) => void)?.(...args);
		};
	});

	return (
		<Frame
			ref={parentRef}
			noBackground
			anchorPoint={"m"}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
		>
			<Frame
				ref={glowRef}
				anchorPoint={props.anchorPoint}
				noBackground
				background={Color3.fromRGB(255, 255, 255)}
				position={props.position}
				size={glowSize}
				zIndex={1}
				cornerRadius={0.075}
			/>

			<ImageButton
				ref={buttonRef}
				anchorPoint={props.anchorPoint}
				autoButtonColor={false}
				background={props.buttonColor}
				position={props.position}
				size={props.size}
				zIndex={2}
				imageTransparency={1}
				cornerRadius={0.075}
				stroke={{
					ref: strokeRef,
					Color: props.buttonStrokeColor,
					Thickness: 4,
				}}
				event={combinedEvents}
			>
				<Text
					noBackground
					anchorPoint={"m"}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(0.9, 0.9)}
					font={props.font}
					text={props.text}
					textColor={props.textColor}
					textSize={"AUTO"}
					zIndex={2}
				/>
				<CanvasGroup
					anchorPoint={"m"}
					background={props.insideButtonColor}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(0.975, 0.9)}
					cornerRadius={0.075}
				>
					<Image
						ref={shineRef}
						noBackground
						anchorPoint={"m"}
						background={Color3.fromRGB(255, 255, 255)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={SHINE_DEFAULT_SIZE}
						image={"rbxassetid://103256287737050"}
						imageTransparency={1}
					/>
				</CanvasGroup>
			</ImageButton>
		</Frame>
	);
}
