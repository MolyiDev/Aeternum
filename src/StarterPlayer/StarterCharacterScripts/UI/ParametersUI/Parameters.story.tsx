import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { ParametersUI } from "./ParametersUI";

const story = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
	},
	() => {
		return <ParametersUI Opacity={0} Position={UDim2.fromScale(0.5, 0.5)} Interactable={true} />;
	},
);

export = story;
