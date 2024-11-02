// Imports
import { Players, RunService, ReplicatedStorage, HttpService, DataStoreService } from "@rbxts/services";
import { IPlayerSavedData } from "ReplicatedStorage/Interfaces/IPlayerSavedData";
import { EControlType } from "ReplicatedStorage/Enums/Settings/EControlType";
import { ECustomInputs } from "ReplicatedStorage/Enums/Settings/ECustomInputs";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { ESettingsAudio } from "ReplicatedStorage/Enums/Settings/ESettingsAudio";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";

// Events
const SettingsSet = ReplicatedStorage.WaitForChild("Events").WaitForChild("SettingsSet") as RemoteEvent;

export class SettingsManager {
	public static DefaultControls = new Map<Enum.KeyCode | Enum.UserInputType | ECustomInputs, [string, number]>([
		[Enum.KeyCode.W, [ESettingsControls.Forward, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Forward, EControlType.Alternative]],
		[Enum.KeyCode.S, [ESettingsControls.Back, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Back, EControlType.Alternative]],
		[Enum.KeyCode.A, [ESettingsControls.Left, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Left, EControlType.Alternative]],
		[Enum.KeyCode.D, [ESettingsControls.Right, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Right, EControlType.Alternative]],
		[Enum.KeyCode.Space, [ESettingsControls.Jump, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Jump, EControlType.Alternative]],
		[Enum.KeyCode.LeftAlt, [ESettingsControls.Climb, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Climb, EControlType.Alternative]],
		[Enum.KeyCode.LeftControl, [ESettingsControls.LockCamera, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.LockCamera, EControlType.Alternative]],
		[Enum.KeyCode.LeftShift, [ESettingsControls.Sprint, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Sprint, EControlType.Alternative]],
		[Enum.KeyCode.C, [ESettingsControls.Crouch, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Crouch, EControlType.Alternative]],
		[Enum.KeyCode.Q, [ESettingsControls.Dash, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Dash, EControlType.Alternative]],
		[Enum.UserInputType.MouseButton1, [ESettingsControls.Attack1, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Attack1, EControlType.Alternative]],
		[Enum.KeyCode.F, [ESettingsControls.Block, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Block, EControlType.Alternative]],
		[Enum.KeyCode.R, [ESettingsControls.HeavyAttack, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.HeavyAttack, EControlType.Alternative]],
		[Enum.KeyCode.One, [ESettingsControls.Ability1, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Ability1, EControlType.Alternative]],
		[Enum.KeyCode.Two, [ESettingsControls.Ability2, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Ability2, EControlType.Alternative]],
		[Enum.KeyCode.Three, [ESettingsControls.Ability3, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Ability3, EControlType.Alternative]],
		[Enum.KeyCode.Four, [ESettingsControls.Ability4, EControlType.Principal]],
		[ECustomInputs.None, [ESettingsControls.Ability4, EControlType.Alternative]],
	]);

	public static KeyMappings = new Map<Enum.UserInputType | Enum.KeyCode | ECustomInputs, string>([
		[Enum.UserInputType.MouseButton1, "M1"],
		[Enum.UserInputType.MouseButton2, "M2"],
		[Enum.UserInputType.MouseButton3, "M3"],
		[Enum.KeyCode.One, "1"],
		[Enum.KeyCode.Two, "2"],
		[Enum.KeyCode.Three, "3"],
		[Enum.KeyCode.Four, "4"],
		[Enum.KeyCode.Five, "5"],
		[Enum.KeyCode.Six, "6"],
		[Enum.KeyCode.Seven, "7"],
		[Enum.KeyCode.Eight, "8"],
		[Enum.KeyCode.Nine, "9"],
		[Enum.KeyCode.Zero, "0"],
		[ECustomInputs.WheelUp, "WheelUp"],
		[ECustomInputs.WheelDown, "WheelDown"],
		[ECustomInputs.None, ""],
	]);

	public static ChangingControls = false;

	public static EncodeControls(controls: Map<Enum.KeyCode | Enum.UserInputType | ECustomInputs, [string, number]>) {
		const newControls: Record<string, [string, number]> = {};
		for (const [key, value] of controls) {
			newControls[tostring(key)] = value;
		}
		return HttpService.JSONEncode(newControls);
	}

	public static DecodeControls(controls: string) {
		if (!controls) return this.DefaultControls;
		const decoded = HttpService.JSONDecode(controls) as Record<string, [string, number]>;
		const newControls = new Map<Enum.KeyCode | Enum.UserInputType | ECustomInputs, [string, number]>();

		for (const [key, value] of pairs(decoded)) {
			const matchedKeyCode = key.match("Enum.KeyCode.([%w_]+)");
			const matchedUserInputType = key.match("Enum.UserInputType.([%w_]+)");
			const matchedEnumCustom = key.match("Setting_Controls_(%w+)");

			if (matchedKeyCode[0]) {
				const enumKey = Enum.KeyCode[matchedKeyCode[0] as unknown as keyof typeof Enum.KeyCode] as Enum.KeyCode;
				newControls.set(enumKey, value);
			} else if (matchedUserInputType[0]) {
				const enumKey = Enum.UserInputType[
					matchedUserInputType[0] as unknown as keyof typeof Enum.UserInputType
				] as Enum.UserInputType;
				newControls.set(enumKey, value);
			} else if (matchedEnumCustom[0]) {
				const enumKey = ECustomInputs[matchedEnumCustom[0] as unknown as keyof typeof ECustomInputs];
				newControls.set(enumKey, value);
			}
		}

		return newControls;
	}

	public static ChangeName(key: Enum.UserInputType | Enum.KeyCode | ECustomInputs) {
		const mappedName = this.KeyMappings.get(key);
		if (mappedName) return mappedName;
		else if (typeIs(key, "EnumItem")) return key.Name;
		else return tostring(key);
	}

	public static GetAllControls(
		player: Player,
	): Map<Enum.UserInputType | Enum.KeyCode | ECustomInputs, [string, number]> {
		const controls = SettingsManager.GetSetting(player, ECustomInputs.All) as string;
		return SettingsManager.DecodeControls(controls);
	}

	public static SaveControls(
		player: Player,
		controls: Map<Enum.KeyCode | Enum.UserInputType | ECustomInputs, [string, number]>,
	) {
		const encoded = SettingsManager.EncodeControls(controls);
		SettingsManager.SetSetting(player, ECustomInputs.All, encoded);
	}

	public static RemovePreviousControl(player: Player, controlToRemove: string, controlType: number) {
		const controls = SettingsManager.GetAllControls(player);
		for (const [input, controlData] of pairs(controls)) {
			if (controlData[0] === controlToRemove && controlData[1] === controlType) {
				controls.delete(input);
				break;
			}
		}
		return controls;
	}

	public static GetControl(player: Player, input: InputObject) {
		const controls = SettingsManager.GetAllControls(player);

		let controlReturn = controls.get(input.KeyCode);

		if (!controlReturn) controlReturn = controls.get(input.UserInputType);

		return controlReturn;
	}

	public static SetControl(
		player: Player,
		input: Enum.KeyCode | Enum.UserInputType | ECustomInputs,
		control: string,
		controlType: number,
	) {
		if (RunService.IsClient()) {
			SettingsSet.FireServer("Controls", input, control, controlType);
		} else {
			if (!input) {
				const controls = SettingsManager.RemovePreviousControl(player, control, controlType);
				SettingsManager.SaveControls(player, controls);
			} else {
				const controls = SettingsManager.RemovePreviousControl(player, control, controlType);
				controls.set(input, [control, controlType]);
				SettingsManager.SaveControls(player, controls);
			}
		}
	}

	public static GetSetting(player: Player, setting: string): AttributeValue | undefined {
		return player.GetAttribute(setting);
	}

	public static SetSetting(player: Player, setting: string, value: AttributeValue) {
		if (RunService.IsClient()) SettingsSet.FireServer("Setting", setting, value);
		else player.SetAttribute(setting, value);
	}

	public static WaitForSettings(player: Player) {
		while (!player.GetAttribute("SettingsLoaded")) task.wait();
	}

	private static CheckBooleanSetting(
		player: Player,
		savedData: IPlayerSavedData,
		enumeration: ESettingsVisual,
		defaultValue: boolean,
	) {
		if (savedData.Visual && savedData.Visual[enumeration] !== undefined) {
			SettingsManager.SetSetting(player, enumeration, savedData.Visual[enumeration]);
		} else {
			SettingsManager.SetSetting(player, enumeration, defaultValue);
		}
	}

	public static Initialize() {
		if (!RunService.IsServer()) return;

		const PlayerSettingsStore = DataStoreService.GetDataStore("PlayerSettings");

		Players.PlayerAdded.Connect((player: Player) => {
			task.wait();

			const [success, savedData] = pcall(() => PlayerSettingsStore.GetAsync(tostring(player.UserId)));
			const data = savedData as IPlayerSavedData;

			if (success && savedData) {
				SettingsManager.SetSetting(
					player,
					ESettingsAudio.Overall,
					data.Audio && data.Audio[ESettingsAudio.Overall] !== undefined
						? data.Audio[ESettingsAudio.Overall]
						: 1,
				);
				SettingsManager.SetSetting(
					player,
					ESettingsAudio.Music,
					data.Audio && data.Audio[ESettingsAudio.Music] !== undefined
						? data.Audio[ESettingsAudio.Music]
						: 0.25,
				);
				SettingsManager.SetSetting(
					player,
					ESettingsAudio.Effects,
					data.Audio && data.Audio[ESettingsAudio.Effects] !== undefined
						? data.Audio[ESettingsAudio.Effects]
						: 0.5,
				);

				this.CheckBooleanSetting(player, data, ESettingsVisual.Shadows, true);
				this.CheckBooleanSetting(player, data, ESettingsVisual.Bloom, true);
				this.CheckBooleanSetting(player, data, ESettingsVisual.DepthOfField, true);

				SettingsManager.SaveControls(player, SettingsManager.DefaultControls);

				/*if (data.Controls && data.Controls[ECustomInputs.All]) {
					const ctrls = data.Controls[ECustomInputs.All];
					SettingsManager.SetSetting(player, ECustomInputs.All, ctrls);
				} else {
					SettingsManager.SaveControls(player, SettingsManager.DefaultControls);
				}*/
			} else {
				SettingsManager.SetSetting(player, ESettingsAudio.Overall, 1);
				SettingsManager.SetSetting(player, ESettingsAudio.Music, 0.25);
				SettingsManager.SetSetting(player, ESettingsAudio.Effects, 0.5);

				SettingsManager.SetSetting(player, ESettingsVisual.Shadows, true);
				SettingsManager.SetSetting(player, ESettingsVisual.Bloom, true);
				SettingsManager.SetSetting(player, ESettingsVisual.DepthOfField, true);

				SettingsManager.SaveControls(player, SettingsManager.DefaultControls);
			}

			player.SetAttribute("SettingsLoaded", true);
		});

		Players.PlayerRemoving.Connect((player) => {
			const settingsData = {
				Audio: {
					[ESettingsAudio.Overall]: SettingsManager.GetSetting(player, ESettingsAudio.Overall),
					[ESettingsAudio.Music]: SettingsManager.GetSetting(player, ESettingsAudio.Music),
					[ESettingsAudio.Effects]: SettingsManager.GetSetting(player, ESettingsAudio.Effects),
				},

				Visual: {
					[ESettingsVisual.Shadows]: SettingsManager.GetSetting(player, ESettingsVisual.Shadows),
					[ESettingsVisual.Bloom]: SettingsManager.GetSetting(player, ESettingsVisual.Bloom),
					[ESettingsVisual.DepthOfField]: SettingsManager.GetSetting(player, ESettingsVisual.DepthOfField),
				},

				Controls: {
					[ECustomInputs.All]:
						SettingsManager.EncodeControls(SettingsManager.GetAllControls(player)) ??
						SettingsManager.DefaultControls,
				},
			};

			const [success, err] = pcall(() => {
				PlayerSettingsStore.SetAsync(tostring(player.UserId), settingsData);
			});

			if (!success) warn("Error saving configuration:", err);
		});

		SettingsSet.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
			const funct = args[0];
			const any = args[1] as string | Enum.KeyCode | Enum.UserInputType | ECustomInputs;
			const any1 = args[2] as string | AttributeValue;
			const any2 = args[3] as number;

			if (!typeIs(funct, "string") || funct !== funct) return;
			if (any !== any) return;
			if (any1 !== any1) return;

			if (funct === "Controls") {
				if (any2 !== any2) return;
				if (typeIs(any, "string")) return;
				if (!typeIs(any1, "string")) return;
				SettingsManager.SetControl(player, any, any1, any2);
			} else if (funct === "Setting") {
				if (typeIs(any, "string")) SettingsManager.SetSetting(player, any, any1);
			}
		});
	}
}
