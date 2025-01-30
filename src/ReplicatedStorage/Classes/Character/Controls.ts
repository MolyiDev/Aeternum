import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { Character } from ".";
import Signal from "@rbxts/lemon-signal";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { GuiService, UserInputService } from "@rbxts/services";
import { ECustomInputsParse } from "ReplicatedStorage/Enums/Settings/ECustomInputs";

export class Controls {
	private Player: Player;
	private DoublePressThreshold: number = 0.2;
	private KeyTimePressed: Map<string, number> = new Map();
	private KeyPressed: Map<string, boolean> = new Map();
	private WindowFocused: boolean = true;
	public InputBeganSignal: Signal<[control: [string, number], input: InputObject, doublePressed: boolean]> =
		new Signal();
	public InputEndedSignal: Signal<(control: [string, number], input: InputObject | undefined) => void> = new Signal();

	constructor(character: Character) {
		this.Player = character.Player!;

		this.GetDoubleTapThreshold();

		character.Butler.Connect(UserInputService.InputBegan, (input: InputObject, processed: boolean) =>
			this.InputBegan(input, processed),
		);
		character.Butler.Connect(UserInputService.InputEnded, (input: InputObject, processed: boolean) =>
			this.InputEnded(input, processed),
		);
		character.Butler.Connect(GuiService.MenuClosed, () => this.FireWindowFocus(true));
		character.Butler.Connect(GuiService.MenuOpened, () => this.FireWindowFocus(false));
		character.Butler.Connect(UserInputService.WindowFocused, () => this.FireWindowFocus(true));
		character.Butler.Connect(UserInputService.WindowFocusReleased, () => this.FireWindowFocus(false));
		character.Butler.Connect(this.Player.AttributeChanged, (attribute: string) => {
			if (attribute !== ESettingsControls.DoubleTapThreshold) return;
			this.GetDoubleTapThreshold();
		});
	}

	public Destroy() {
		this.KeyTimePressed.clear();
		this.KeyPressed.clear();
		this.InputBeganSignal.Destroy();
		this.InputEndedSignal.Destroy();

		this.DoublePressThreshold = undefined!;
		this.KeyTimePressed = undefined!;
		this.KeyPressed = undefined!;
		this.WindowFocused = undefined!;
		this.InputBeganSignal = undefined!;
		this.InputEndedSignal = undefined!;
	}

	private GetDoubleTapThreshold() {
		this.DoublePressThreshold = SettingsManager.GetSetting(
			this.Player,
			ESettingsControls.DoubleTapThreshold,
		) as number;
	}

	private InputBegan(input: InputObject, processed: boolean) {
		if (input.UserInputType === Enum.UserInputType.MouseMovement) this.FireWindowFocus(true);
		if (processed) return;
		const control = SettingsManager.GetControl(this.Player, input);
		if (!control) return;

		const currentTime = tick();
		let doublePressed = false;
		const timeSinceLastPress = currentTime - (this.KeyTimePressed.get(control[0]) ?? 0);
		if (timeSinceLastPress <= this.DoublePressThreshold) doublePressed = true;
		this.KeyTimePressed.set(control[0], currentTime);
		this.KeyPressed.set(control[0], true);

		this.InputBeganSignal.Fire(control, input, doublePressed);
	}

	private InputEnded(input: InputObject, processed: boolean) {
		if (input.UserInputType === Enum.UserInputType.MouseMovement) this.FireWindowFocus(false);
		const control = SettingsManager.GetControl(this.Player, input);
		if (!control) return;
		if (processed && !this.KeyPressed.get(control[0])) return;

		this.KeyPressed.set(control[0], false);

		this.InputEndedSignal.Fire(control, input);
	}

	private FireWindowFocus(bool: boolean) {
		if (this.WindowFocused === bool) return;
		this.WindowFocused = bool;
		if (!this.WindowFocused) return;
		const controls = SettingsManager.GetAllControls(this.Player);

		for (const key of this.KeyPressed) {
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
			this.InputEndedSignal.Fire(controlSN, undefined);
		}
	}

	public IsKeyDown = (key: string): boolean => this.KeyPressed.get(key) ?? false;
	public IsWindowFocused = () => this.WindowFocused;
}
