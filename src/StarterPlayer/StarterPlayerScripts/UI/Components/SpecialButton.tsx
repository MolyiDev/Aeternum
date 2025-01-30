/* eslint-disable roblox-ts/lua-truthiness */
import Object from "@rbxts/object-utils";
import React, { InstanceEvent, useEffect, useRef, useState } from "@rbxts/react";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { useScale } from "./SliceScale";

interface ISpecialButton extends React.InstanceProps<ImageButton> {
	ButtonColor?: Color3;
	TextProps: React.InstanceProps<TextLabel>;
}

const TWEENINFO = new TweenInfo(0.375, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWEENINFO_CLICK = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

export function SpecialButton(props: ISpecialButton) {
	const glowRef = useRef<Frame>(undefined!);
	const shineRef = useRef<ImageLabel>(undefined!);
	const buttonRef = useRef<ImageButton>(undefined!);
	const parentRef = useRef<Frame>(undefined!);
	const [glowSize, setGlowSize] = useState<UDim2 | undefined>(undefined);
	const sliceScale = useScale(1.75);

	const BUTTON_DEFAULT_SIZE = (props.Size ?? new UDim2()) as UDim2;
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
				Size: glowSize ? UDim2.fromScale(glowSize.X.Scale - 0.01, glowSize.Y.Scale - 0.015) : 0,
			});
		},

		MouseButton1Up: (butt, x, y) => {
			Tools.TweenPlay(butt, TWEENINFO_CLICK, { Size: BUTTON_DEFAULT_SIZE });
			Tools.TweenPlay(shineRef.current, TWEENINFO_CLICK, { Size: SHINE_DEFAULT_SIZE });
			Tools.TweenPlay(glowRef.current, TWEENINFO_CLICK, { Size: glowSize });
		},

		MouseEnter: () => {
			Tools.TweenPlay(shineRef.current, TWEENINFO, { ImageTransparency: 0.55 });
			Tools.TweenPlay(glowRef.current, TWEENINFO, { Transparency: 0.95 });
		},

		MouseLeave: (butt) => {
			Tools.TweenPlay(shineRef.current, TWEENINFO, { Size: SHINE_DEFAULT_SIZE });
			Tools.TweenPlay(shineRef.current, TWEENINFO_CLICK, { ImageTransparency: 1 });
			Tools.TweenPlay(glowRef.current, TWEENINFO, { Transparency: 1 });
			Tools.TweenPlay(glowRef.current, TWEENINFO_CLICK, { Size: glowSize });
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

	Object.entries(props.Event ?? {}).forEach(([eventName, customHandler]) => {
		const defaultHandler = combinedEvents[eventName as keyof InstanceEvent<ImageButton>];
		combinedEvents[eventName as keyof InstanceEvent<ImageButton>] = (...args) => {
			(defaultHandler as (...args: unknown[]) => void)?.(...args);
			(customHandler as (...args: unknown[]) => void)?.(...args);
		};
	});

	return (
		<frame
			ref={parentRef}
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Center}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
		>
			<frame
				ref={glowRef}
				AnchorPoint={props.AnchorPoint}
				BackgroundTransparency={1}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				Position={props.Position}
				Size={glowSize}
				ZIndex={1}
			>
				<uicorner CornerRadius={new UDim(0.075)} />
			</frame>

			<imagebutton
				ref={buttonRef}
				AnchorPoint={props.AnchorPoint}
				AutoButtonColor={false}
				BackgroundTransparency={1}
				Position={props.Position}
				Size={props.Size}
				ZIndex={2}
				Image={"rbxassetid://86294135049485"}
				ImageColor3={props.ButtonColor}
				ImageTransparency={0.1}
				ResampleMode={"Pixelated"}
				ScaleType={"Slice"}
				SliceCenter={new Rect(new Vector2(12, 12), new Vector2(36, 36))}
				SliceScale={sliceScale}
				Event={combinedEvents}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					FontFace={props.TextProps.FontFace}
					Text={props.TextProps.Text}
					TextColor3={props.TextProps.TextColor3}
					TextScaled={true}
					ZIndex={2}
				/>
				<canvasgroup
					AnchorPoint={AnchorPoints.Center}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
				>
					<imagelabel
						ref={shineRef}
						BackgroundTransparency={1}
						AnchorPoint={AnchorPoints.Center}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={SHINE_DEFAULT_SIZE}
						Image={"rbxassetid://103256287737050"}
						ImageTransparency={1}
					/>
				</canvasgroup>
			</imagebutton>
		</frame>
	);
}
