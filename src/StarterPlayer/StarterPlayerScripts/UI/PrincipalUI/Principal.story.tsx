import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { PrincipalUI } from "./PrincipalUI";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<PrincipalUI
				Opacity={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Interactable={true}
				PlayTouched={() => {}}
				SettingsTouched={() => {}}
				CreditsTouched={() => {}}
			/>
		);
	},
);

export = story;
