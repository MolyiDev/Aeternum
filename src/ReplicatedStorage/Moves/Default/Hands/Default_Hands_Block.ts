// Imports
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const BlockInfo = {
	[EAnimations.Default_Hands_Block]: {
		Move: true,
	},
};

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.Block}`, {})
class Default_Hands_Block implements IMove {
	private Character: Character;
	private IsActive: boolean = false;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		this.Character = character;
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_Block);
	}

	public Start() {
		if (this.IsActive || this.Character.Attributes.IsStunned()) return;

		this.IsActive = true;
		this.Character.Tweens.SetSpeed(EMovementSpeeds.Blocking, 0.2);
		this.Character.Tweens.SetJump(EMovementJumps.Blocking, 0.2);
		this.Character.States.SetState(EMovementState.Blocking, true);

		this.Animation.Play(0.175, 1, 1.4);
	}

	public Stop() {
		if (!this.IsActive) return;
		this.IsActive = false;

		this.Character.Tweens.SetSpeed(EMovementSpeeds.Default, 0.2);
		this.Character.Tweens.SetJump(EMovementJumps.Default, 0.2);
		this.Character.States.SetState(EMovementState.Blocking, false);

		this.Animation.Stop(0.175);
	}

	public Destroy() {
		this.Stop();

		this.Character = undefined!;
		this.IsActive = undefined!;
		this.Animation = undefined!;
	}
}

export { Default_Hands_Block, BlockInfo };
