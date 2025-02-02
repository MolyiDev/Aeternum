import { ReplicatedStorage, RunService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { CBase } from "./CBase";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityUse = Events.WaitForChild("AbilityUse") as RemoteEvent;
const AbilityUseConstant = Events.WaitForChild("AbilityUseConstant") as UnreliableRemoteEvent;
const AbilityUseFunction = Events.WaitForChild("AbilityUseFunction") as RemoteFunction;

export abstract class CAbility extends CBase {
	private FunctionSignal: (...args: Array<unknown>) => void;
	private FunctionSignalConstant: (...args: Array<unknown>) => void;
	private FunctionFunction: (...args: Array<unknown>) => Array<unknown>;
	public Ability!: EAbility | string;

	constructor(character: Character) {
		super(character);

		if (RunService.IsClient()) {
			this.FunctionSignal = (...args: Array<unknown>) => AbilityUse.FireServer(this.Ability, ...args);
			this.FunctionSignalConstant = (...args: Array<unknown>) =>
				AbilityUseConstant.FireServer(this.Ability, ...args);
			this.FunctionFunction = (...args: Array<unknown>): Array<unknown> =>
				AbilityUseFunction.InvokeServer(this.Ability, ...args);
		} else {
			const ReplicateServer = this.Character.ReplicateServer;

			this.FunctionSignal = (...args: Array<unknown>) => ReplicateServer.SignalFired(this.Ability, ...args);

			this.FunctionSignalConstant = (...args: Array<unknown>) =>
				ReplicateServer.SignalFired(this.Ability, ...args);

			this.FunctionFunction = (...args: Array<unknown>) => ReplicateServer.SignalFired(this.Ability, ...args);
		}
	}

	public FireSignal = (...args: Array<unknown>) => this.FunctionSignal(...args);
	public FireSignalConstant = (...args: unknown[]) => this.FunctionSignalConstant(...args);
	public FireFunction = (...args: unknown[]): Array<unknown> => this.FunctionFunction(...args);

	public abstract Start(): void;

	public Destroy() {
		this.Ability = undefined!;
		super.Destroy();
	}
}
