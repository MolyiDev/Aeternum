// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { AbilityInfo } from "ReplicatedStorage/Attributes/AbilityInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const AbilityUse = Events.WaitForChild("AbilityUse") as RemoteEvent;

const Cooldown = 5;

const ElectricKickInfo = {
	[EAnimations.ElectricKick]: {
		Ability: true,
		CanFeint: true,
		Signal: true,
		Sound: true,
		Cooldown: Cooldown,
	},
};

@AbilityInfo(EAbility.ElectricKick, {
	Weapon: EWeapons.Hands,
	Cooldown: Cooldown,
	Damage: [10, 10, 20],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 0,
	Blockeable: true,
	Dasheable: true,
})
class ElectricKick implements IAbility {
	public Name = script.Name;
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

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
	}
}

export { ElectricKick, ElectricKickInfo };
