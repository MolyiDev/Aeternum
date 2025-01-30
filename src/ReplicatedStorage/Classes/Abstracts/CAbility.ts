import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { CBase } from "./CBase";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityUse = Events.WaitForChild("AbilityUse") as RemoteEvent;
const AbilityUseConstant = Events.WaitForChild("AbilityUseConstant") as UnreliableRemoteEvent;
const AbilityUseFunction = Events.WaitForChild("AbilityUseFunction") as RemoteFunction;

export abstract class CAbility extends CBase {
	public Ability!: EAbility | string;

	constructor(character: Character) {
		super(character);
	}

	public FireSignal = () => AbilityUse.FireServer(this.Ability);
	public FireSignalConstant = () => AbilityUseConstant.FireServer(this.Ability);
	public FireFunction = (): boolean => AbilityUseFunction.InvokeServer(this.Ability);

	public abstract Start(): void;

	public Destroy() {
		this.Ability = undefined!;
		super.Destroy();
	}
}
