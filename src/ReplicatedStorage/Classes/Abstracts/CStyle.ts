import { ReplicatedStorage, RunService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { CBase } from "./CBase";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const StyleUse = Events.WaitForChild("StyleUse") as RemoteEvent;
const StyleUseConstant = Events.WaitForChild("StyleUseConstant") as UnreliableRemoteEvent;
const StyleUseFunction = Events.WaitForChild("StyleUseFunction") as RemoteFunction;

export abstract class CStyle extends CBase {
	private FunctionSignal: (...args: Array<unknown>) => void;
	private FunctionSignalConstant: (...args: Array<unknown>) => void;
	private FunctionFunction: (...args: Array<unknown>) => Array<unknown>;
	public Style!: EStyleType | string;

	constructor(character: Character) {
		super(character);

		if (RunService.IsClient()) {
			this.FunctionSignal = (...args: Array<unknown>) => StyleUse.FireServer(this.Style, ...args);
			this.FunctionSignalConstant = (...args: Array<unknown>) => StyleUseConstant.FireServer(this.Style, ...args);
			this.FunctionFunction = (...args: Array<unknown>): Array<unknown> =>
				StyleUseFunction.InvokeServer(this.Style, ...args);
		} else {
			const ReplicateServer = this.Character.ReplicateServer;

			this.FunctionSignal = (...args: Array<unknown>) =>
				ReplicateServer.SignalFired(
					`${this.Styles.Style}_${this.Weapons.EquippedWeapon}_${this.Style}`,
					...args,
				);

			this.FunctionSignalConstant = (...args: Array<unknown>) =>
				ReplicateServer.SignalFired(
					`${this.Styles.Style}_${this.Weapons.EquippedWeapon}_${this.Style}`,
					...args,
				);

			this.FunctionFunction = (...args: Array<unknown>) =>
				ReplicateServer.SignalFired(
					`${this.Styles.Style}_${this.Weapons.EquippedWeapon}_${this.Style}`,
					...args,
				);
		}
	}

	public FireSignal = (...args: Array<unknown>) => this.FunctionSignal(...args);
	public FireSignalConstant = (...args: unknown[]) => this.FunctionSignalConstant(...args);
	public FireFunction = (...args: unknown[]): Array<unknown> => this.FunctionFunction(...args);

	public abstract Start(...args: unknown[]): void;
	public StartConstant?(...args: unknown[]): void;
	public Stop?(...args: unknown[]): void;

	public IsOnCooldown(): boolean {
		const ReplicateInfo = ModuleManager.GetReplicateInfo(
			`${this.Styles.Style}_${this.Weapons.EquippedWeapon}_${this.Style}`,
		)!;
		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - this.Attributes.TickAnim(this.Style);
			if (time < ReplicateInfo.Cooldown) return true;
		}

		return false;
	}

	public Destroy() {
		this.Style = undefined!;
		super.Destroy();
	}
}
