// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const MoveUse = Events.WaitForChild("MoveUse") as RemoteEvent;

const Cooldown = 6.5;

const CrouchAttackInfo = {
	[EAnimations.Default_Hands_CrouchAttack]: {
		Move: true,
		Signal: true,
		Sound: true,
		Cooldown: Cooldown,
	},
};

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.CrouchAttack}`, {
	Cooldown: Cooldown,
	Damage: [10, 10, 20],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 0,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_CrouchAttack implements IMove {
	private Character: Character;

	constructor(character: Character) {
		this.Character = character;
	}

	public Start() {
		if (this.Character.Attributes.IsStunned() || !Tools.IsTouchingGround(this.Character.Humanoid, true)) return;

		MoveUse.FireServer(this.Character.Moves.MoveSet, EMove.CrouchAttack);
	}

	public Destroy() {
		this.Character = undefined!;
	}
}

export { Default_Hands_CrouchAttack, CrouchAttackInfo };
