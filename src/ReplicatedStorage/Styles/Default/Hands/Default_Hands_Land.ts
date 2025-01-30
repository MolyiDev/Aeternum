// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Land}`;
const LANDING_LARGE_HEIGHT = -160;

const Default_Hands_LandInfo = {
	[EAnimations.Default_Hands_LandShort]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_LandLarge]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[Style]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Land extends CStyle {
	private StateChanged: RBXScriptConnection;
	private AnimationLarge: AnimationTrack;
	private AnimationShort: AnimationTrack;

	constructor(character: Character) {
		super(character);
		[this.AnimationShort, this.AnimationLarge] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_LandShort,
			EAnimations.Default_Hands_LandLarge,
		);

		this.StateChanged = character.Butler.Connect(
			character.Humanoid.StateChanged,
			(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) => {
				if (newState === Enum.HumanoidStateType.Landed) this.States.SetState(EMovementState.Landing, true);
				else this.States.SetState(EMovementState.Landing, false);
			},
		);
	}

	public Destroy() {
		this.Butler.Remove(this.StateChanged);

		this.StateChanged = undefined!;
		this.AnimationLarge = undefined!;
		this.AnimationShort = undefined!;

		super.Destroy();
	}

	public Start() {
		if (this.HumanoidRootPart.AssemblyLinearVelocity.Y < LANDING_LARGE_HEIGHT) {
			if (this.Attributes.IgnoreLandStun()) return;

			this.Attributes.SelfStun(1.5, EStunType.Full);
			this.AnimationLarge.Play(0.2, 1);
		} else {
			if (this.States.IsInState(EMovementState.Sliding)) return;
			this.AnimationShort.Play(0.15, 1, 1.35);
		}
	}

	public Stop(speed: number) {
		if (this.AnimationLarge.IsPlaying) return;
		const Speed = speed ? speed : 0.1;
		this.AnimationShort.Stop(Speed);
	}
}

export { Default_Hands_Land, Default_Hands_LandInfo };
