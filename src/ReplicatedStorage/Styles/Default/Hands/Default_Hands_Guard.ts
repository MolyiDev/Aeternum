// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Guard}`;

const Default_Hands_GuardInfo = {
	[EAnimations.Default_Hands_Guard]: {
		ReplicateStunned: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Guard extends CStyle {
	private IsActive: boolean = false;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		super(character);
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_Guard);
	}

	public Start() {
		if (this.IsActive || this.States.IsInState(EMovementState.Running) || !this.States.IsGrounded()) return;

		this.IsActive = true;
		this.States.SetState(EMovementState.Guarding, true);

		this.Animation.Play(0.4, 1, 1.5);
	}

	public Stop() {
		if (!this.IsActive) return;
		this.IsActive = false;
		this.States.SetState(EMovementState.Guarding, false);

		this.Animation.Stop(0.4);
	}

	public Destroy() {
		this.Stop();

		this.IsActive = undefined!;
		this.Animation = undefined!;

		super.Destroy();
	}
}

export { Default_Hands_Guard, Default_Hands_GuardInfo };
