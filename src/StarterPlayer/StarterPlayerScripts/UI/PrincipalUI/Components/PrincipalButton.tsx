/* eslint-disable roblox-ts/lua-truthiness */
import Object from "@rbxts/object-utils";
import React, { InstanceEvent, useRef } from "@rbxts/react";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ImageButtonShadow } from "../../Components/Shadows";

const ButtonImage: { [key: string]: string } = {
	["Play"]: "rbxassetid://105364107495830",
	["Settings"]: "rbxassetid://116180872686320",
	["Credits"]: "rbxassetid://83228874315798",
};

interface IPrincipalButton extends React.InstanceProps<ImageButton> {
	Type: string;
	AspectRatio?: number;
}

const TWEENINFO = new TweenInfo(0.45, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWEENINFO_CLICK = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

export function PrincipalButton(props: IPrincipalButton) {
	const glowRef = useRef<ImageLabel>(undefined!);
	const buttonRef = useRef<CanvasGroup>(undefined!);

	const BUTTON_DEFAULT_SIZE = (props.Size ?? new UDim2()) as UDim2;
	const BUTTON_CLICK_SIZE = UDim2.fromScale(BUTTON_DEFAULT_SIZE.X.Scale - 0.01, BUTTON_DEFAULT_SIZE.Y.Scale - 0.015);

	const combinedEvents: InstanceEvent<ImageButton> = {
		MouseButton1Down: () => {
			Tools.TweenPlay(buttonRef.current, TWEENINFO_CLICK, { Size: BUTTON_CLICK_SIZE });
		},

		MouseButton1Up: () => {
			Tools.TweenPlay(buttonRef.current, TWEENINFO_CLICK, { Size: BUTTON_DEFAULT_SIZE });
		},

		MouseEnter: (btn) => {
			Tools.TweenPlay(glowRef.current, TWEENINFO, { ImageTransparency: 0.7 });
			Tools.TweenPlay(btn, TWEENINFO, { ImageColor3: Color3.fromRGB(0, 0, 0) });
		},

		MouseLeave: (btn) => {
			Tools.TweenPlay(glowRef.current, TWEENINFO, { ImageTransparency: 1 });
			Tools.TweenPlay(buttonRef.current, TWEENINFO_CLICK, { Size: BUTTON_DEFAULT_SIZE });
			Tools.TweenPlay(btn, TWEENINFO, { ImageColor3: Color3.fromRGB(255, 255, 255) });
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
		<canvasgroup
			ref={buttonRef}
			AnchorPoint={props.AnchorPoint}
			BackgroundTransparency={1}
			Position={props.Position}
			Size={props.Size}
		>
			{props.AspectRatio ? <uiaspectratioconstraint AspectRatio={props.AspectRatio} /> : undefined}

			<imagelabel
				ref={glowRef}
				AnchorPoint={AnchorPoints.Center}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={"rbxassetid://90796135736210"}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
				ImageTransparency={1}
				ResampleMode={"Pixelated"}
				ScaleType={"Stretch"}
				ZIndex={0}
			/>

			<ImageButtonShadow
				AnchorPoint={AnchorPoints.Center}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				ZIndex={1}
				Image={"rbxassetid://87520375153022"}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
				ResampleMode={"Pixelated"}
				ScaleType={"Stretch"}
				Event={combinedEvents}
			/>

			<imagelabel
				AnchorPoint={AnchorPoints.Center}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={"rbxassetid://100856823374896"}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
				ResampleMode={"Pixelated"}
				ScaleType={"Stretch"}
				ZIndex={2}
			/>

			<imagelabel
				AnchorPoint={AnchorPoints.Center}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={ButtonImage[props.Type]}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
				ResampleMode={"Pixelated"}
				ScaleType={"Stretch"}
				ZIndex={3}
			/>
		</canvasgroup>
	);
}
