// Imports
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const GuardInfo = {
	[EAnimations.Default_Hands_Guard]: {
		Move: true,
	},
};

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.Guard}`, {})
class Default_Hands_Guard implements IMove {
	private Character: Character;
	private IsActive: boolean = false;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		this.Character = character;
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_Guard);
	}

	public Start() {
		if (
			this.IsActive ||
			this.Character.States.IsInState(EMovementState.Running) ||
			!Tools.IsTouchingGround(this.Character.Humanoid)
		)
			return;

		this.IsActive = true;
		this.Character.States.SetState(EMovementState.Guarding, true);

		this.Animation.Play(0.35, 5, 1.5);
	}

	public Stop() {
		if (!this.IsActive) return;
		this.IsActive = false;
		this.Character.States.SetState(EMovementState.Guarding, false);

		this.Animation.Stop(0.35);
	}

	public Destroy() {
		this.Stop();

		this.Character = undefined!;
		this.IsActive = undefined!;
		this.Animation = undefined!;
	}
}

export { Default_Hands_Guard, GuardInfo };
