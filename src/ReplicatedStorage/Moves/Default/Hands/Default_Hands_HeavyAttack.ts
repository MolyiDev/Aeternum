// Imports
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const Cooldown = 7.5;

const HeavyAttackInfo = {
	[EAnimations.Default_Hands_HeavyAttack]: {
		Move: true,
		Sound: true,
		Cooldown: Cooldown,
	},
};

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.HeavyAttack}`, {
	Cooldown: Cooldown,
	Damage: [20],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 0,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_HeavyAttack implements IMove {
	private Character: Character;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		this.Character = character;
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_HeavyAttack);
	}

	public Start() {
		if (this.Character.Attributes.IsStunned() || !Tools.IsTouchingGround(this.Character.Humanoid, true)) return;

		this.Character.Attributes.SelfStun(1, EStunType.Partial);
		this.Animation.Play(0.2);
	}

	public Destroy() {
		this.Character = undefined!;
		this.Animation = undefined!;
	}
}

export { Default_Hands_HeavyAttack, HeavyAttackInfo };
