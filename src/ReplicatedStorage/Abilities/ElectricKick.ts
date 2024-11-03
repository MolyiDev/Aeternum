// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityUse = Events.WaitForChild("AbilityUse") as RemoteEvent;

export class ElectricKick implements IAbility {
	private Attributes: Attributes;
	private Humanoid: IHumanoid;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
		this.Humanoid = character.Humanoid;
	}

	public Start() {
		if (this.Attributes.IsStunned() || !Tools.IsTouchingGround(this.Humanoid, true)) return;

		AbilityUse.FireServer(EAbility.ElectricKick);
	}

	public GetAbility() {
		return EAbility.ElectricKick;
	}

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
	}
}
