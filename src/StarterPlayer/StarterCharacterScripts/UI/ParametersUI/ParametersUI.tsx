import React, { useRef } from "@rbxts/react";
import { forwardRef } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { EParameter } from "ReplicatedStorage/Enums/EParameter";
import { AnchorPoints } from "ReplicatedStorage/Enums/UI/EAnchorPoint";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);

interface IParametersUI {
	Opacity?: number;
	Position: UDim2;
	Interactable?: boolean;
}

const WAIT = 0.5;
const TWINFO = new TweenInfo(0.35, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
const PlusHealthGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(0, 153, 115)),
	new ColorSequenceKeypoint(0.5, Color3.fromRGB(3, 125, 92)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(0, 153, 115)),
]);
const MinusHealthGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, Color3.fromRGB(84, 8, 33)),
	new ColorSequenceKeypoint(0.5, Color3.fromRGB(64, 5, 28)),
	new ColorSequenceKeypoint(1, Color3.fromRGB(84, 8, 33)),
]);

const PlusNumenGradient = new ColorSequence(Color3.fromRGB(64, 204, 114), Color3.fromRGB(64, 204, 114));
const MinusNumenGradient = new ColorSequence(Color3.fromRGB(161, 148, 8), Color3.fromRGB(117, 107, 3));

const PlusResilienceGradient = new ColorSequence(Color3.fromRGB(64, 204, 114), Color3.fromRGB(64, 204, 114));
const MinusResilienceGradient = new ColorSequence(Color3.fromRGB(3, 122, 105), Color3.fromRGB(3, 89, 77));

const PlusUltimateGradient = new ColorSequence(Color3.fromRGB(255, 255, 255), Color3.fromRGB(240, 240, 240));
const MinusUltimateGradient = new ColorSequence(Color3.fromRGB(15, 15, 15), Color3.fromRGB(5, 5, 5));

const BackgroundGradient = new ColorSequence(Color3.fromRGB(50, 50, 50), Color3.fromRGB(10, 10, 10));

export const ParametersUI = forwardRef<CanvasGroup, IParametersUI>((props, ref) => {
	const parameterText = useRef<TextLabel>(undefined!);

	const healthTopGradient = useRef<UIGradient>(undefined!);
	const healthBottomGradient = useRef<UIGradient>(undefined!);

	const numenTopGradient = useRef<UIGradient>(undefined!);
	const numenBottomGradient = useRef<UIGradient>(undefined!);

	const resilienceTopGradient = useRef<UIGradient>(undefined!);
	const resilienceBottomGradient = useRef<UIGradient>(undefined!);

	const ultimateTopGradient = useRef<UIGradient>(undefined!);
	const ultimateBottomGradient = useRef<UIGradient>(undefined!);

	//const ModifyNumber = 10;

	let Health = Character.Parameters.Get(EParameter.Health);
	let Ultimate = Character.Parameters.Get(EParameter.Ultimate);
	let Resilience = Character.Parameters.Get(EParameter.Resilience);
	let Numen = Character.Parameters.Get(EParameter.Numen);

	Character.Butler.Connect(Character.Parameters.ParameterChanged, (parameter: string, newValue: number) => {
		switch (parameter) {
			case EParameter.Health:
				Modify(
					Health,
					newValue,
					CalculateHealthTransparency(
						Character.Parameters.Get(EParameter.Health),
						Character.Parameters.GetMax(EParameter.Health),
					),
					healthBottomGradient.current,
					healthTopGradient.current,
					PlusHealthGradient,
					MinusHealthGradient,
				);

				Health = newValue;
				break;
			case EParameter.Ultimate:
				Modify(
					Ultimate,
					newValue,
					CalculateHorizontalTransparency(
						Character.Parameters.Get(EParameter.Ultimate),
						Character.Parameters.GetMax(EParameter.Ultimate),
					),
					ultimateBottomGradient.current,
					ultimateTopGradient.current,
					PlusUltimateGradient,
					MinusUltimateGradient,
				);

				Ultimate = newValue;
				break;
			case EParameter.Resilience:
				Modify(
					Resilience,
					newValue,
					CalculateHorizontalTransparency(
						Character.Parameters.Get(EParameter.Resilience),
						Character.Parameters.GetMax(EParameter.Resilience),
					),
					resilienceBottomGradient.current,
					resilienceTopGradient.current,
					PlusResilienceGradient,
					MinusResilienceGradient,
				);

				Resilience = newValue;
				break;
			case EParameter.Numen:
				Modify(
					Numen,
					newValue,
					CalculateHorizontalTransparency(
						Character.Parameters.Get(EParameter.Numen),
						Character.Parameters.GetMax(EParameter.Numen),
					),
					numenBottomGradient.current,
					numenTopGradient.current,
					PlusNumenGradient,
					MinusNumenGradient,
				);

				Numen = newValue;
				break;
		}
	});

	function CalculateHealthTransparency(value: number, maxValue: number): NumberSequence {
		const lifePercentage = math.clamp(value / maxValue, 0, 1);
		const ZeroOrOne = value === 0 ? 1 : 0;

		const second = new NumberSequenceKeypoint(Tools.LerpNumber(0, 0.5, 1 - lifePercentage), 1);
		const third = new NumberSequenceKeypoint(Tools.LerpNumber(0.02, 0.5, 1 - lifePercentage), ZeroOrOne);
		const fifth = new NumberSequenceKeypoint(Tools.LerpNumber(0.5, 0.98, lifePercentage), ZeroOrOne);
		const sixth = new NumberSequenceKeypoint(Tools.LerpNumber(0.5, 1, lifePercentage), 1);

		return new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			second,
			third,
			new NumberSequenceKeypoint(0.5, ZeroOrOne),
			fifth,
			sixth,
			new NumberSequenceKeypoint(1, 1),
		]);
	}

	function CalculateHorizontalTransparency(value: number, maxValue: number): NumberSequence {
		const percentage = math.clamp(value / maxValue, 0, 1);
		const zeroOrOne = value === 0 ? 1 : 0;

		const midLeft = new NumberSequenceKeypoint(Tools.LerpNumber(0, 1, 1 - percentage), 1);
		const midRight = new NumberSequenceKeypoint(Tools.LerpNumber(0.02, 1, 1 - percentage), zeroOrOne);

		return new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			midLeft,
			midRight,
			new NumberSequenceKeypoint(1, zeroOrOne),
		]);
	}

	function Modify(
		oldValue: number,
		value: number,
		numberSequence: NumberSequence,
		bottomGradient: UIGradient,
		topGradient: UIGradient,
		plusColor: ColorSequence,
		minusColor: ColorSequence,
	) {
		if (value > oldValue) {
			bottomGradient.Color = plusColor;
			Tools.TweenTransparency(bottomGradient, TWINFO, numberSequence);
			task.wait(WAIT);
			Tools.TweenTransparency(topGradient, TWINFO, numberSequence);
		} else {
			bottomGradient.Color = minusColor;
			Tools.TweenTransparency(topGradient, TWINFO, numberSequence);
			task.wait(WAIT);
			Tools.TweenTransparency(bottomGradient, TWINFO, numberSequence);
		}
	}

	return (
		<canvasgroup
			GroupTransparency={props.Opacity}
			BackgroundTransparency={1}
			AnchorPoint={AnchorPoints.Center}
			Position={props.Position}
			Size={UDim2.fromScale(1, 1)}
			Interactable={false}
		>
			{/*
			<textbox
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.1)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Text={"10"}
				TextSize={20}
				Event={{
					FocusLost: (rbx) => {
						ModifyNumber = tonumber(rbx.Text) ?? 10;
					},
				}}
			/>

			<textbutton
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.15)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Text={"Health"}
				TextSize={20}
				Event={{ Activated: () => Character.Parameters.Modify(EParameter.Health, ModifyNumber) }}
			/>

			<textbutton
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.2)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Text={"Numen"}
				TextSize={20}
				Event={{ Activated: () => Character.Parameters.Modify(EParameter.Numen, ModifyNumber) }}
			/>

			<textbutton
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.25)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Text={"Resilience"}
				TextSize={20}
				Event={{ Activated: () => Character.Parameters.Modify(EParameter.Resilience, ModifyNumber) }}
			/>

			<textbutton
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.3)}
				Size={UDim2.fromScale(0.1, 0.05)}
				Text={"Ultimate"}
				TextSize={20}
				Event={{ Activated: () => Character.Parameters.Modify(EParameter.Ultimate, ModifyNumber) }}
			/>*/}

			<canvasgroup
				key={"Health"}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.873)}
				Size={UDim2.fromScale(0.26, 0.1)}
				ZIndex={1}
			>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://73587763086799"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={0}
				>
					<uigradient Color={BackgroundGradient} Rotation={90} />
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://73587763086799"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={1}
				>
					<uigradient
						ref={healthBottomGradient}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.001, 1),
								new NumberSequenceKeypoint(0.002, 0),
								new NumberSequenceKeypoint(0.5, 0),
								new NumberSequenceKeypoint(0.998, 0),
								new NumberSequenceKeypoint(0.999, 1),
								new NumberSequenceKeypoint(1, 1),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://73587763086799"}
					ImageColor3={Color3.fromRGB(181, 0, 6)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={2}
				>
					<uigradient
						ref={healthTopGradient}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(255, 5, 50)),
								new ColorSequenceKeypoint(0.5, Color3.fromRGB(85, 1, 20)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(255, 5, 50)),
							])
						}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.001, 1),
								new NumberSequenceKeypoint(0.002, 0),
								new NumberSequenceKeypoint(0.5, 0),
								new NumberSequenceKeypoint(0.998, 0),
								new NumberSequenceKeypoint(0.999, 1),
								new NumberSequenceKeypoint(1, 1),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://100229570658152"}
					ImageColor3={Color3.fromRGB(255, 217, 0)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={3}
				/>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://79892427116438"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={4}
				/>
			</canvasgroup>
			<canvasgroup
				key={"Ultimate"}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.5, 0.851)}
				Size={UDim2.fromScale(0.28, 0.07)}
				ZIndex={0}
			>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://92861101240580"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={0}
				>
					<uigradient
						Rotation={90}
						Color={new ColorSequence(Color3.fromRGB(255, 255, 255), Color3.fromRGB(185, 185, 185))}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://92861101240580"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={1}
				>
					<uigradient
						ref={ultimateBottomGradient}
						Rotation={90}
						Color={new ColorSequence(Color3.fromRGB(40, 40, 40), Color3.fromRGB(80, 80, 80))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.98, 1),
								new NumberSequenceKeypoint(1, 1),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://92861101240580"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={2}
				>
					<uigradient
						ref={ultimateTopGradient}
						Rotation={90}
						Color={new ColorSequence(Color3.fromRGB(10, 10, 10), Color3.fromRGB(35, 35, 35))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.98, 1),
								new NumberSequenceKeypoint(1, 1),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
			</canvasgroup>
			<canvasgroup
				key={"Resilience"}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.56, 0.907)}
				Size={UDim2.fromScale(0.095, 0.05)}
				ZIndex={2}
			>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://127139860703039"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={0}
				>
					<uigradient Color={BackgroundGradient} Rotation={90} />
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://127139860703039"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={1}
				>
					<uigradient
						ref={resilienceBottomGradient}
						Rotation={197}
						Color={new ColorSequence(Color3.fromRGB(3, 122, 105), Color3.fromRGB(3, 89, 77))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.05, 0),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://127139860703039"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={2}
				>
					<uigradient
						ref={resilienceTopGradient}
						Rotation={197}
						Color={new ColorSequence(Color3.fromRGB(0, 255, 217), Color3.fromRGB(0, 130, 111))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.05, 0),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://79989290635693"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={3}
				/>
			</canvasgroup>
			<canvasgroup
				key={"Numen"}
				BackgroundTransparency={1}
				AnchorPoint={AnchorPoints.Center}
				Position={UDim2.fromScale(0.44, 0.907)}
				Size={UDim2.fromScale(0.095, 0.05)}
				ZIndex={2}
			>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://77271865466797"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={0}
				>
					<uigradient Color={BackgroundGradient} Rotation={90} />
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://77271865466797"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={1}
				>
					<uigradient
						ref={numenBottomGradient}
						Rotation={-17}
						Color={new ColorSequence(Color3.fromRGB(161, 148, 8), Color3.fromRGB(117, 107, 3))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.05, 0),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://77271865466797"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={2}
				>
					<uigradient
						ref={numenTopGradient}
						Rotation={-17}
						Color={new ColorSequence(Color3.fromRGB(255, 234, 0), Color3.fromRGB(165, 151, 0))}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0, 1),
								new NumberSequenceKeypoint(0.05, 0),
								new NumberSequenceKeypoint(1, 0),
							])
						}
					/>
				</imagelabel>
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={AnchorPoints.Center}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://100869197518356"}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
					ResampleMode={"Pixelated"}
					ScaleType={"Stretch"}
					ZIndex={3}
				/>
			</canvasgroup>
		</canvasgroup>
	);
});
