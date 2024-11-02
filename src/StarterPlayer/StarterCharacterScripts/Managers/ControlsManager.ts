// Imports
import Signal from "@rbxts/lemon-signal";
import { GuiService, Players, ReplicatedStorage, UserInputService } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ECustomInputsParse } from "ReplicatedStorage/Enums/Settings/ECustomInputs";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const Inputs = Events.WaitForChild("Inputs");
const InputBeganEvent = Inputs.WaitForChild("InputBegan") as RemoteEvent;
const InputEndedEvent = Inputs.WaitForChild("InputEnded") as RemoteEvent;
const LocalInputBeganSignal = new Signal<[control: [string, number], input: InputObject, doublePressed: boolean]>();
const LocalInputEndedSignal = new Signal<(control: [string, number], input: InputObject | undefined) => void>();

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Butler = Character.Butler;
const KeyTimePressed = new Map<string, number>();
const KeyPressed = new Map<string, boolean>();
let WindowFocused = true;

const DOUBLE_TAP_TIME = 0.2;

export class ControlManager {
	public static LocalInputBegan = LocalInputBeganSignal;
	public static LocalInputEnded = LocalInputEndedSignal;

	public static IsKeyDown = (key: string): boolean => KeyPressed.get(key) ?? false;
	public static IsWindowFocused = () => WindowFocused;
}

function FireInputBegan(control: [string, number], input: InputObject, doublePressed: boolean) {
	//InputBegan.FireServer(control, input, doublePressed);
	LocalInputBeganSignal.Fire(control, input, doublePressed);
}

function FireInputEnded(control: [string, number], input: InputObject | undefined) {
	//InputEnded.FireServer(control, input);
	LocalInputEndedSignal.Fire(control, input);
}

function FireWindowFocus(bool: boolean) {
	if (WindowFocused === bool) return;
	WindowFocused = bool;
	if (!WindowFocused) return;
	const controls = SettingsManager.GetAllControls(Player);

	for (const key of pairs(KeyPressed)) {
		if (!key[1]) continue;
		let keyCode: Enum.KeyCode | undefined;
		let controlSN: [string, number] | undefined;

		for (const control of pairs(controls)) {
			if (key[0] !== control[1][0]) continue;
			if (typeIs(control[0], "EnumItem")) {
				if (control[0].EnumType === Enum.KeyCode) {
					keyCode = control[0] as Enum.KeyCode;
					controlSN = control[1];
					break;
				}
			} else if (ECustomInputsParse(control[0])) print();
		}

		if (!keyCode || !controlSN || UserInputService.IsKeyDown(keyCode)) continue;
		FireInputEnded(controlSN, undefined);
	}
}

function InputBegan(input: InputObject, processed: boolean) {
	if (input.UserInputType === Enum.UserInputType.MouseMovement) FireWindowFocus(true);
	if (processed) return;
	const control = SettingsManager.GetControl(Player, input);
	if (!control) return;

	const currentTime = tick();
	let doublePressed = false;
	const timeSinceLastPress = currentTime - (KeyTimePressed.get(control[0]) ?? 0);
	if (timeSinceLastPress <= DOUBLE_TAP_TIME) doublePressed = true;
	KeyTimePressed.set(control[0], currentTime);
	KeyPressed.set(control[0], true);

	FireInputBegan(control, input, doublePressed);
}

function InputEnded(input: InputObject, processed: boolean) {
	if (input.UserInputType === Enum.UserInputType.MouseMovement) FireWindowFocus(false);
	const control = SettingsManager.GetControl(Player, input);
	if (!control) return;
	if (processed && !KeyPressed.get(control[0])) return;

	KeyPressed.set(control[0], false);

	FireInputEnded(control, input);
}

Butler.Connect(UserInputService.InputBegan, (input: InputObject, processed: boolean) => InputBegan(input, processed));

Butler.Connect(UserInputService.InputEnded, (input: InputObject, processed: boolean) => InputEnded(input, processed));

Butler.Connect(GuiService.MenuClosed, () => {
	FireWindowFocus(true);
});

Butler.Connect(GuiService.MenuOpened, () => {
	FireWindowFocus(false);
});

Butler.Connect(UserInputService.WindowFocused, () => {
	FireWindowFocus(true);
});

Butler.Connect(UserInputService.WindowFocusReleased, () => {
	FireWindowFocus(false);
});
