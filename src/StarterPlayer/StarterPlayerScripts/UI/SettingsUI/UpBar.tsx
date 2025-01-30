import React, { useEffect, useRef, useState } from "@rbxts/react";
import { ImageButtonShadow, TextLabelShadow } from "StarterPlayer/StarterPlayerScripts/UI/Components/Shadows";
import { ESettingsPanels } from "./Components/Enums/ESettingsPanels";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";

interface IUpBar {
	initialPanel: ESettingsPanels;
	audioPanel: React.MutableRefObject<CanvasGroup>;
	controlsPanel: React.MutableRefObject<CanvasGroup>;
	visualPanel: React.MutableRefObject<CanvasGroup>;
	generalPanel: React.MutableRefObject<CanvasGroup>;
	PanelSelected?: (panel: ESettingsPanels) => void;
}

const PANEL_DEFAULT_POSITION = UDim2.fromScale(0.5, 0.025);
const PANEL_RIGHT_POSITION = UDim2.fromScale(1.15, 0.5);
const PANEL_LEFT_POSITION = UDim2.fromScale(-0.15, 0.5);
const SELECTED_COLOR = Color3.fromRGB(0, 0, 0);
const DEFAULT_COLOR = Color3.fromRGB(255, 255, 255);
const DEFAULT_TRANSPARENCY = 0.55;
const HOVER_TRANSPARENCY = 0.25;
const TWEEN_PANEL = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
const TWEEN_HOVER_BUTTON = new TweenInfo(0.35, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);

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
			new ColorSequence([
				new ColorSequenceKeypoint(0, SELECTED_COLOR),
				new ColorSequenceKeypoint(0.15, DEFAULT_COLOR),

				new ColorSequenceKeypoint(scaleX - 0.03 + Offset, DEFAULT_COLOR),
				new ColorSequenceKeypoint(scaleX + Offset, SELECTED_COLOR),
				new ColorSequenceKeypoint(scaleX + 0.03 + Offset, DEFAULT_COLOR),

				new ColorSequenceKeypoint(0.85, DEFAULT_COLOR),
				new ColorSequenceKeypoint(1, SELECTED_COLOR),
			]),
		);

		Tools.TweenPlay(IconPanel, TWEEN_PANEL, { GroupTransparency: 0 });
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
				panel = props.controlsPanel.current;
				button = upBarIcons.current
					.FindFirstChild("Controls")!
					.GetDescendants()
					.find((inst) => inst.IsA("ImageButton"));
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
		<canvasgroup BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.15)}>
			<ImageButtonShadow
				AnchorPoint={AnchorPoints.CenterRight}
				Position={UDim2.fromScale(0.985, 0.435)}
				Size={UDim2.fromScale(0.042, 0.496)}
				Image={"rbxassetid://107893206131443"}
				AspectRatio={1.006}
				ShadowAngle={45}
				ShadowTransparency={0.55}
				ShadowDistance={5}
			/>

			<TextLabelShadow
				AnchorPoint={AnchorPoints.TopLeft}
				Position={UDim2.fromScale(0.018, 0.2)}
				Size={UDim2.fromScale(0.24, 0.55)}
				FontFace={Font.fromName("TitilliumWeb", Enum.FontWeight.Bold)}
				Text={text}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
				ShadowAngle={45}
				ShadowTransparency={0.55}
				ShadowDistance={5}
			/>

			<frame
				ref={upBarDiamonds}
				AnchorPoint={AnchorPoints.Bottom}
				BackgroundColor3={DEFAULT_COLOR}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.8)}
				Size={UDim2.fromScale(0.983, 0.035)}
			>
				<uigradient
					ref={diamondsGradientRef}
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, SELECTED_COLOR),
							new ColorSequenceKeypoint(0.15, DEFAULT_COLOR),

							new ColorSequenceKeypoint(0.5 - 0.03, DEFAULT_COLOR),
							new ColorSequenceKeypoint(0.5, SELECTED_COLOR),
							new ColorSequenceKeypoint(0.5 + 0.03, DEFAULT_COLOR),

							new ColorSequenceKeypoint(0.85, DEFAULT_COLOR),
							new ColorSequenceKeypoint(1, SELECTED_COLOR),
						])
					}
				/>

				<uigridlayout
					CellPadding={UDim2.fromScale(0.054, 0.048)}
					CellSize={UDim2.fromScale(0.022, 7.061)}
					FillDirection={"Vertical"}
					HorizontalAlignment={"Center"}
					VerticalAlignment={"Center"}
					SortOrder={"LayoutOrder"}
				/>

				<imagelabel
					key={"Audio"}
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Image={"rbxassetid://109254184865400"}
					LayoutOrder={4}
				>
					<uiaspectratioconstraint AspectRatio={1.038} />
				</imagelabel>

				<imagelabel
					key={"Controls"}
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Image={"rbxassetid://109254184865400"}
					LayoutOrder={3}
				>
					<uiaspectratioconstraint AspectRatio={1.038} />
				</imagelabel>

				<imagelabel
					key={"Visual"}
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Image={"rbxassetid://109254184865400"}
					LayoutOrder={2}
				>
					<uiaspectratioconstraint AspectRatio={1.038} />
				</imagelabel>

				<imagelabel
					key={"General"}
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Image={"rbxassetid://109254184865400"}
					LayoutOrder={1}
				>
					<uiaspectratioconstraint AspectRatio={1.038} />
				</imagelabel>
			</frame>

			<frame
				ref={upBarIcons}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Top}
				Position={UDim2.fromScale(0.5, 0.02)}
				Size={UDim2.fromScale(1, 0.75)}
			>
				<uigridlayout
					CellPadding={UDim2.fromScale(0.02, 0.02)}
					CellSize={UDim2.fromScale(0.055, 0.865)}
					HorizontalAlignment={"Center"}
					VerticalAlignment={"Center"}
					SortOrder={"LayoutOrder"}
				/>
				<canvasgroup
					key={"Audio"}
					BackgroundTransparency={1}
					GroupTransparency={DEFAULT_TRANSPARENCY}
					AnchorPoint={AnchorPoints.Center}
					LayoutOrder={4}
				>
					<ImageButtonShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Image={"rbxassetid://72441646416779"}
						AspectRatio={1.006}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
						Event={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.audioPanel.current, butt);
							},
						}}
					/>
				</canvasgroup>

				<canvasgroup
					key={"Controls"}
					BackgroundTransparency={1}
					GroupTransparency={DEFAULT_TRANSPARENCY}
					AnchorPoint={AnchorPoints.Center}
					LayoutOrder={3}
				>
					<ImageButtonShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.85, 0.85)}
						Image={"rbxassetid://90196346676136"}
						AspectRatio={1.006}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
						Event={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.controlsPanel.current, butt);
							},
						}}
					/>
				</canvasgroup>

				<canvasgroup
					key={"Visual"}
					BackgroundTransparency={1}
					GroupTransparency={DEFAULT_TRANSPARENCY}
					AnchorPoint={AnchorPoints.Center}
					LayoutOrder={2}
				>
					<ImageButtonShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.7, 0.7)}
						Image={"rbxassetid://91690284827643"}
						AspectRatio={1.006}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
						Event={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.visualPanel.current, butt);
							},
						}}
					/>
				</canvasgroup>

				<canvasgroup
					key={"General"}
					BackgroundTransparency={1}
					GroupTransparency={DEFAULT_TRANSPARENCY}
					AnchorPoint={AnchorPoints.Center}
					LayoutOrder={1}
				>
					<ImageButtonShadow
						AnchorPoint={AnchorPoints.Center}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.65, 0.65)}
						Image={"rbxassetid://117575756600362"}
						AspectRatio={1.006}
						ShadowAngle={45}
						ShadowTransparency={0.55}
						ShadowDistance={5}
						Event={{
							MouseEnter: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: HOVER_TRANSPARENCY,
								});
							},

							MouseLeave: (butt) => {
								if (butt === selectedButtonRef.current) return;
								Tools.TweenPlay(butt.Parent!.Parent!, TWEEN_HOVER_BUTTON, {
									GroupTransparency: DEFAULT_TRANSPARENCY,
								});
							},

							Activated: (butt) => {
								if (butt === selectedButtonRef.current) return;
								ChangePanel(props.generalPanel.current, butt);
							},
						}}
					/>
				</canvasgroup>
			</frame>
		</canvasgroup>
	);
}
