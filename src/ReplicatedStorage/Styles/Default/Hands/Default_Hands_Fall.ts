// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Fall}`;

const Default_Hands_FallInfo = {
	[EAnimations.Default_Hands_Fall]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Fall extends CStyle {
	private IsActive: boolean = false;
	private StateChanged: RBXScriptConnection;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		super(character);
		this.Animation = this.Animations.GetAnimation(EAnimations.Default_Hands_Fall);

		this.StateChanged = character.Butler.Connect(
			character.Humanoid.StateChanged,
			(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) => {
				if (
					newState === Enum.HumanoidStateType.Freefall ||
					newState === Enum.HumanoidStateType.FallingDown ||
					newState === Enum.HumanoidStateType.Flying
				)
					this.States.SetState(EMovementState.Falling, true, 0.65);
				else this.States.SetState(EMovementState.Falling, false);
			},
		);
	}

	public Destroy() {
		this.Butler.Remove(this.StateChanged);

		this.IsActive = undefined!;
		this.Animation = undefined!;
		this.StateChanged = undefined!;

		super.Destroy();
	}

	public Start() {
		if (this.IsActive) return;
		this.IsActive = true;

		this.Animation.Play(0.2);
	}

	public Stop(speed: number) {
		if (!this.IsActive) return;
		this.IsActive = false;
		const Speed = speed ? speed : 0.25;

		this.States.SetState(EMovementState.Falling, false);
		this.Animation.Stop(Speed);
	}
}

export { Default_Hands_Fall, Default_Hands_FallInfo };
