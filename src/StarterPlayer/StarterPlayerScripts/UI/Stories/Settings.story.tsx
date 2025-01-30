import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { SettingsUI } from "../SettingsUI/SettingsUI";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return (
			<SettingsUI Opacity={0} Position={UDim2.fromScale(0.5, 0.5)} Interactable={true} CloseTouched={() => {}} />
		);
	},
);

export = story;
