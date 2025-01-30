import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "@rbxts/react";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

const Player = Players.LocalPlayer;

const positions: UDim2[] = [
	UDim2.fromScale(0.5, 0.045),
	UDim2.fromScale(0.93, 0.5),
	UDim2.fromScale(0.5, 0.89),
	UDim2.fromScale(0.07, 0.5),
];

const TInfo = new TweenInfo(0.25, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

interface IEmotesGUI {
	opacity?: number;
	position: UDim2;
	interactable?: boolean;
}

interface AnimationControllerEmote extends AnimationController {
	Animator: Animator;
}

interface EmoteCharacter extends Model {
	AnimationController: AnimationControllerEmote;
	UpperTorso: BasePart;
}

const EmoteCharacter = ReplicatedStorage.WaitForChild("EmoteCharacter") as EmoteCharacter;
const Emote1Animation = ReplicatedStorage.WaitForChild("Animations")
	.WaitForChild("Emotes")
	.WaitForChild("Emote1") as Animation;

export const EmotesGUI = forwardRef<CanvasGroup, IEmotesGUI>((props, ref) => {
	const emotesRef = useRef<CanvasGroup>(undefined!);
	const viewportRefs = [
		useRef<ViewportFrame>(undefined!),
		useRef<ViewportFrame>(undefined!),
		useRef<ViewportFrame>(undefined!),
		useRef<ViewportFrame>(undefined!),
	];

	useImperativeHandle(ref, () => emotesRef.current);

	viewportRefs.forEach((viewportRef) => {
		useEffect(() => {
			if (!viewportRef.current) return;

			viewportRef.current.SetAttribute("Emote", "Emote1");

			const clonedModel = EmoteCharacter.Clone();
			clonedModel.Parent = viewportRef.current;

			const camera = new Instance("Camera", viewportRef.current);
			camera.CFrame = new CFrame(new Vector3(0, 1.25, 5)).mul(CFrame.Angles(math.rad(-15), 0, 0));
			camera.CameraSubject = clonedModel.UpperTorso;
			viewportRef.current.CurrentCamera = camera;

			const Animation1 = clonedModel.AnimationController.Animator.LoadAnimation(Emote1Animation);
			const Animation2 = clonedModel.AnimationController.Animator.LoadAnimation(Emote1Animation);

			Animation1.Play(0.5);
			Animation1.Stopped.Connect(() => Animation2.Play(0.5));
			Animation2.Stopped.Connect(() => Animation1.Play(0.5));

			return () => {
				clonedModel.Destroy();
				camera.Destroy();
			};
		}, [viewportRef.current]);
	});

	return (
		<canvasgroup
			ref={emotesRef}
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Center}
			Position={props.position}
			Size={UDim2.fromScale(1, 1)}
			GroupTransparency={props.opacity}
			Interactable={props.interactable}
		>
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.313, 0.556)}
				Image={"rbxassetid://134137576993286"}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={0.55}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				{viewportRefs.map((viewportRef, index) => {
					return (
						<viewportframe
							key={index}
							ref={viewportRef}
							Active={true}
							AnchorPoint={AnchorPoints.Center}
							Position={positions[index]}
							BackgroundTransparency={1}
							Size={UDim2.fromScale(0.36, 0.36)}
							Event={{
								MouseEnter: (frame) => {
									Tools.TweenPlay(frame, TInfo, {
										Size: UDim2.fromScale(0.425, 0.425),
									});
								},
								MouseLeave: (frame) => {
									Tools.TweenPlay(frame, TInfo, {
										Size: UDim2.fromScale(0.36, 0.36),
									});
								},
								InputBegan: (frame, inputObject) => {
									if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
									const Character = CharacterManager.GetCharacterByModel(Player.Character);
									if (!Character || Character.IsDestroyed) return;
									const EmoteAnim = Character.Animations.GetAnimation(
										frame.GetAttribute("Emote") as string,
									);
									if (EmoteAnim.IsPlaying) return;
									EmoteAnim.Play(0.25);
								},
							}}
						>
							<uiaspectratioconstraint />
						</viewportframe>
					);
				})}
			</imagelabel>
		</canvasgroup>
	);
});
