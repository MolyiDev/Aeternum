import { CreateVideStory, InferVideControls } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";
import { UpBar } from "./UpBar";

const Controls = {
	Visible: true,
};

function UI(controls: InferVideControls<typeof Controls>) {
	return (
		<canvasgroup
			Name={"SettingsGUI"}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
		>
			<frame
				Name={"Background"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={0.1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<uigradient
					Color={new ColorSequence(Color3.fromRGB(22, 22, 22), Color3.fromRGB(49, 49, 49))}
					Rotation={90}
				/>
			</frame>

			<frame
				Name={"TopFade"}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.002)}
				Size={UDim2.fromScale(1, 0.225)}
			>
				<uigradient
					Color={new ColorSequence(Color3.fromRGB(0, 0, 0), Color3.fromRGB(26, 26, 26))}
					Rotation={90}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 0.3, 0),
							new NumberSequenceKeypoint(0.535, 0.475, 0),
							new NumberSequenceKeypoint(1, 1, 1),
						])
					}
				/>
			</frame>

			<UpBar />
		</canvasgroup>
	);
}

const story = CreateVideStory(
	{
		vide: Vide,
		controls: Controls,
	},
	(props) => {
		return UI(props.controls);
	},
);

export = story;
