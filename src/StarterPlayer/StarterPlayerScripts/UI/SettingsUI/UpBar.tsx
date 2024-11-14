import { AnchorPoints, CanvasGroup, Frame, GridLayout, Image } from "@rbxts/better-react-components";
import { createColorSequence, GradientElement } from "@rbxts/better-react-components/out/helpers/Gradient";
import React, { useEffect, useRef, useState } from "@rbxts/react";
import { ImageButtonShadow, TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { ESettingsPanels } from "./Components/Enums/ESettingsPanels";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

interface IUpBar {
	initialPanel: ESettingsPanels;
	audioPanel: React.MutableRefObject<CanvasGroup>;
	controlsPanel?: React.MutableRefObject<CanvasGroup>;
	visualPanel: React.MutableRefObject<CanvasGroup>;
	generalPanel: React.MutableRefObject<CanvasGroup>;
	PanelSelected?: (panel: ESettingsPanels) => void;
}

const PANEL_DEFAULT_POSITION = UDim2.fromScale(0.5, 0.5);
const PANEL_RIGHT_POSITION = UDim2.fromScale(1.15, 0.5);
const PANEL_LEFT_POSITION = UDim2.fromScale(-0.15, 0.5);
const SELECTED_COLOR = Color3.fromRGB(167, 59, 73);
const DEFAULT_COLOR = Color3.fromRGB(255, 255, 255);
const DEFAULT_TRANSPARENCY = 0.55;
const HOVER_TRANSPARENCY = 0.25;
const TWEEN_PANEL = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

const Offset = 0.011;

export function UpBar(props: IUpBar) {
	const [text, setText] = useState(props.initialPanel as unknown as string);
	const upBarDiamonds = useRef<Frame>(undefined!);
	const upBarIcons = useRef<Frame>(undefined!);

	const diamondsGradientRef = useRef<UIGradient>(undefined!);

	const selectedButtonRef = useRef<ImageButton>(undefined!);
	const selectedPanelRef = useRef<CanvasGroup>(undefined!);

	function ChangePanel(panel: CanvasGroup, button: ImageButton) {
		const DiamondPanel = upBarDiamonds.current.FindFirstChild(panel.Name)! as Frame;
		const IconPanel = upBarIcons.current.FindFirstChild(panel.Name)!;

		const selectedPanel = selectedPanelRef.current;
		if (selectedPanel) {
			selectedPanel.Interactable = false;
			const DiamondSelected = upBarDiamonds.current.FindFirstChild(selectedPanel.Name)! as Frame;
			const IconSelected = upBarIcons.current.FindFirstChild(selectedPanel.Name)!;

			Tools.TweenPlay(IconSelected, TWEEN_PANEL, { GroupTransparency: 0.55 });
			Tools.TweenPlay(selectedButtonRef.current, TWEEN_PANEL, { ImageColor3: DEFAULT_COLOR });
			Tools.TweenPlay(DiamondSelected, TWEEN_PANEL, { ImageColor3: DEFAULT_COLOR });

			if (DiamondSelected.LayoutOrder > DiamondPanel.LayoutOrder) {
				panel.Position = PANEL_LEFT_POSITION;
				Tools.TweenPlay(selectedPanel, TWEEN_PANEL, { Position: PANEL_RIGHT_POSITION, GroupTransparency: 1 });
			} else {
				panel.Position = PANEL_RIGHT_POSITION;
				Tools.TweenPlay(selectedPanel, TWEEN_PANEL, { Position: PANEL_LEFT_POSITION, GroupTransparency: 1 });
			}
		}

		const diamondPanelXRelative = DiamondPanel.AbsolutePosition.X - upBarDiamonds.current.AbsolutePosition.X;
		const scaleX = diamondPanelXRelative / upBarDiamonds.current.AbsoluteSize.X;

		Tools.TweenGradient(
			diamondsGradientRef.current,
			TWEEN_PANEL,
			createColorSequence([
				new ColorSequenceKeypoint(0, SELECTED_COLOR),
				new ColorSequenceKeypoint(0.15, DEFAULT_COLOR),

				new ColorSequenceKeypoint(scaleX - 0.025 + Offset, DEFAULT_COLOR),
				new ColorSequenceKeypoint(scaleX + Offset, SELECTED_COLOR),
				new ColorSequenceKeypoint(scaleX + 0.025 + Offset, DEFAULT_COLOR),

				new ColorSequenceKeypoint(0.85, DEFAULT_COLOR),
				new ColorSequenceKeypoint(1, SELECTED_COLOR),
			]),
		);

		Tools.TweenPlay(IconPanel, TWEEN_PANEL, { GroupTransparency: 0 });
		Tools.TweenPlay(button, TWEEN_PANEL, { ImageColor3: SELECTED_COLOR });
		Tools.TweenPlay(DiamondPanel, TWEEN_PANEL, { ImageColor3: SELECTED_COLOR });

		Tools.TweenPlay(panel, TWEEN_PANEL, { Position: PANEL_DEFAULT_POSITION, GroupTransparency: 0 });
		selectedPanelRef.current = panel;
		selectedButtonRef.current = button;
		setText(panel.Name);
		panel.Interactable = true;
	}

	useEffect(() => {
		let panel: CanvasGroup | undefined = undefined;
		let button: ImageButton | undefined = undefined;

		// Determina el panel y el botón que deben seleccionarse según initialPanel
		switch (props.initialPanel) {
			case ESettingsPanels.Audio:
				panel = props.audioPanel.current;
				button = upBarIcons.current
					.FindFirstChild("Audio")!
					.GetDescendants()
					.find((inst) => inst.IsA("ImageButton"));
				break;
			case ESettingsPanels.Controls:
				if (props.controlsPanel) {
					panel = props.controlsPanel.current;
					button = upBarIcons.current
						.FindFirstChild("Controls")!
						.GetDescendants()
						.find((inst) => inst.IsA("ImageButton"));
				}
				break;
			case ESettingsPanels.Visual:
				panel = props.visualPanel.current;
				button = upBarIcons.current
					.FindFirstChild("Visual")!
					.GetDescendants()
					.find((inst) => inst.IsA("ImageButton"));
				break;
			case ESettingsPanels.General:
				panel = props.generalPanel.current;
				button = upBarIcons.current
					.FindFirstChild("General")!
					.GetDescendants()
					.find((inst) => inst.IsA("ImageButton"));
				break;
		}

		if (panel && button) ChangePanel(panel, button);
	}, []);

	return (
		<CanvasGroup noBackground size={UDim2.fromScale(1, 0.15)}>
			<ImageButtonShadow
				anchorPoint={"mr"}
				position={UDim2.fromScale(0.992, 0.37)}
				size={UDim2.fromScale(0.042, 0.496)}
				image={"rbxassetid://107893206131443"}
				shadowAngle={45}
				shadowTransparency={0.55}
				shadowDistance={5}
			/>

			<TextLabelShadow
				anchorPoint={"tl"}
				position={UDim2.fromScale(0.0125, 0.11)}
				size={UDim2.fromScale(0.24, 0.55)}
				font={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
				text={text}
				textColor={Color3.fromRGB(255, 255, 255)}
				textSize={"AUTO"}
				textAlign={Enum.TextXAlignment.Left}
				shadowAngle={45}
				shadowTransparency={0.55}
				shadowDistance={5}
			/>

			<Frame
				ref={upBarDiamonds}
				anchorPoint={AnchorPoints.Bottom}
				position={UDim2.fromScale(0.5, 0.78)}
				size={UDim2.fromScale(1, 0.035)}
			>
				<GradientElement
					ref={diamondsGradientRef}
					color={createColorSequence([
						new ColorSequenceKeypoint(0, SELECTED_COLOR),
						new ColorSequenceKeypoint(0.15, DEFAULT_COLOR),

						new ColorSequenceKeypoint(0.5 - 0.025, DEFAULT_COLOR),
						new ColorSequenceKeypoint(0.5, SELECTED_COLOR),
						new ColorSequenceKeypoint(0.5 + 0.025, DEFAULT_COLOR),

						new ColorSequenceKeypoint(0.85, DEFAULT_COLOR),
						new ColorSequenceKeypoint(1, SELECTED_COLOR),
					])}
				/>

				<GridLayout
					cellPadding={UDim2.fromScale(0.054, 0.048)}
					cellSize={UDim2.fromScale(0.021, 7.061)}
					direction={"Vertical"}
					horizontalAlign={"Center"}
					verticalAlign={"Center"}
					sortOrder={"LayoutOrder"}
				/>

				<Image
					name={"Audio"}
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
					layoutOrder={4}
				/>

				<Image
					name={"Controls"}
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
					layoutOrder={3}
				/>

				<Image
					name={"Visual"}
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
					layoutOrder={2}
				/>

				<Image
					name={"General"}
					noBackground
					anchorPoint={AnchorPoints.Middle}
					image={"rbxassetid://109254184865400"}
					layoutOrder={1}
				/>
			</Frame>

			<Frame
				ref={upBarIcons}
				noBackground
				anchorPoint={AnchorPoints.Top}
				position={UDim2.fromScale(0.5, 0)}
				size={UDim2.fromScale(1, 0.75)}
			>
				<GridLayout
					cellPadding={UDim2.fromScale(0.02, 0.02)}
					cellSize={UDim2.fromScale(0.055, 0.865)}
					horizontalAlign={"Center"}
					verticalAlign={"Center"}
					sortOrder={"LayoutOrder"}
				/>
				<CanvasGroup
					name={"Audio"}
					noBackground
					opacity={DEFAULT_TRANSPARENCY}
					anchorPoint={AnchorPoints.Middle}
					layoutOrder={4}
				>
					<ImageButtonShadow
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.8, 0.8)}
						image={"rbxassetid://72441646416779"}
						shadowAngle={45}
						shadowTransparency={0.55}
						shadowDistance={5}
						imageEvent={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.audioPanel.current, butt);
							},
						}}
					/>
				</CanvasGroup>

				<CanvasGroup
					name={"Controls"}
					noBackground
					opacity={DEFAULT_TRANSPARENCY}
					anchorPoint={AnchorPoints.Middle}
					layoutOrder={3}
				>
					<ImageButtonShadow
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.85, 0.85)}
						image={"rbxassetid://90196346676136"}
						shadowAngle={45}
						shadowTransparency={0.55}
						shadowDistance={5}
						imageEvent={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								//ChangePanel(props.controlsPanel.current, butt);
							},
						}}
					/>
				</CanvasGroup>

				<CanvasGroup
					name={"Visual"}
					noBackground
					opacity={DEFAULT_TRANSPARENCY}
					anchorPoint={AnchorPoints.Middle}
					layoutOrder={2}
				>
					<ImageButtonShadow
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.7, 0.7)}
						image={"rbxassetid://91690284827643"}
						shadowAngle={45}
						shadowTransparency={0.55}
						shadowDistance={5}
						imageEvent={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.visualPanel.current, butt);
							},
						}}
					/>
				</CanvasGroup>

				<CanvasGroup
					name={"General"}
					noBackground
					opacity={DEFAULT_TRANSPARENCY}
					anchorPoint={AnchorPoints.Middle}
					layoutOrder={1}
				>
					<ImageButtonShadow
						anchorPoint={"m"}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(0.65, 0.65)}
						image={"rbxassetid://117575756600362"}
						shadowAngle={45}
						shadowTransparency={0.55}
						shadowDistance={5}
						imageEvent={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_PANEL, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.generalPanel.current, butt);
							},
						}}
					/>
				</CanvasGroup>
			</Frame>
		</CanvasGroup>
	);
}
