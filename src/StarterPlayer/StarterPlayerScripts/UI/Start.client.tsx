/* eslint-disable no-constant-condition */
import { Icon } from "@rbxts/topbar-plus";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const TInfo = new TweenInfo(0.55, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
const TInfoEmotes1 = new TweenInfo(1.2, Enum.EasingStyle.Back, Enum.EasingDirection.InOut);
const TInfoEmotes2 = new TweenInfo(1.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

let EmotesRef: CanvasGroup | undefined;
let EmotesActive = false;

function DeactiveEmotesIcon() {
	EmotesRef!.Interactable = false;
	Tools.TweenPlay(EmotesRef!, TInfoEmotes1, {
		Position: UDim2.fromScale(0.5, 0.7),
		Rotation: -90,
	});
	Tools.TweenPlay(EmotesRef!, TInfoEmotes2, {
		GroupTransparency: 1,
	});

	EmotesActive = false;
}

/*SettingsIcon.selected.Connect(() => {
	if (!SettingsRef) return;
	if (EmotesActive && EmotesRef) {
		DeactiveEmotesIcon();
	}
	SettingsRef.Position = UDim2.fromScale(0.5, 0.7);
	SettingsRef.Interactable = true;
	Tools.TweenPlay(SettingsRef, TInfo, {
		Position: UDim2.fromScale(0.5, 0.5),
		GroupTransparency: 0,
	});
	SettingsIcon.deselect();
	Icon.setTopbarEnabled(false);
});*/
