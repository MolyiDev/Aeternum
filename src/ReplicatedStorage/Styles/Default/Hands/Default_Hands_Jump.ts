// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Jump}`;
const DOUBLEJUMP_FORCE_UP = 80;

const Default_Hands_JumpInfo = {
	[EAnimations.Default_Hands_RunJump1]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_RunJump2]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkJump1]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_WalkJump2]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DoubleJumpFront]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DoubleJumpLeft]: {
		ReplicateStunned: true,
		CanOverride: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DoubleJumpRight]: {
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
class Default_Hands_Jump extends CStyle {
	private IsJumping: boolean = false;
	private DoubleJumped: boolean = false;
	private JumpToggle: boolean = false;
	private StateChanged: RBXScriptConnection;
	private WalkJump1: AnimationTrack;
	private WalkJump2: AnimationTrack;
	private RunJump1: AnimationTrack;
	private RunJump2: AnimationTrack;
	private DoubleJumpFront: AnimationTrack;
	private DoubleJumpBack: AnimationTrack;
	private DoubleJumpLeft: AnimationTrack;
	private DoubleJumpRight: AnimationTrack;

	constructor(character: Character) {
		super(character);
		[
			this.WalkJump1,
			this.WalkJump2,
			this.RunJump1,
			this.RunJump2,
			this.DoubleJumpFront,
			this.DoubleJumpBack,
			this.DoubleJumpLeft,
			this.DoubleJumpRight,
		] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_WalkJump1,
			EAnimations.Default_Hands_WalkJump2,
			EAnimations.Default_Hands_RunJump1,
			EAnimations.Default_Hands_RunJump2,
			EAnimations.Default_Hands_DoubleJumpFront,
			EAnimations.Default_Hands_DoubleJumpBack,
			EAnimations.Default_Hands_DoubleJumpLeft,
			EAnimations.Default_Hands_DoubleJumpRight,
		);

		this.StateChanged = character.Butler.Connect(
			character.Humanoid.StateChanged,
			(oldState: Enum.HumanoidStateType, newState: Enum.HumanoidStateType) => {
				if (newState === Enum.HumanoidStateType.Jumping) this.States.SetState(EMovementState.Jumping, true);
				else this.States.SetState(EMovementState.Jumping, false);
			},
		);
	}

	public Destroy() {
		this.Butler.Remove(this.StateChanged);

		this.IsJumping = undefined!;
		this.DoubleJumped = undefined!;
		this.JumpToggle = undefined!;
		this.StateChanged = undefined!;
		this.WalkJump1 = undefined!;
		this.WalkJump2 = undefined!;
		this.RunJump1 = undefined!;
		this.RunJump2 = undefined!;
		this.DoubleJumpFront = undefined!;
		this.DoubleJumpLeft = undefined!;
		this.DoubleJumpRight = undefined!;

		super.Destroy();
	}

	public Start(startType: string) {
		if (startType === "Normal") {
			// Normal Jump
			if (this.IsJumping) return;

			this.IsJumping = true;
			if (this.States.IsInState(EMovementState.Running)) {
				if (this.States.IsInState(EMovementState.SlidingJump)) return;
				if (this.JumpToggle) this.RunJump2.Play(0.3, 1, 1.4);
				else this.RunJump1.Play(0.3, 1, 1.4);
				this.JumpToggle = !this.JumpToggle;
			} else {
				if (this.JumpToggle) this.WalkJump1.Play(0.25);
				else this.WalkJump2.Play(0.25);
				this.JumpToggle = !this.JumpToggle;
			}
		} else {
			// Double Jump
			if (this.DoubleJumped || this.States.IsGrounded() || this.Attributes.IsStunned()) return;
			this.Humanoid.ChangeState(Enum.HumanoidStateType.Jumping);

			this.IsJumping = true;
			this.DoubleJumped = true;

			const Direction = Tools.WorldMovingDirection(
				this.Character.HumanoidRootPart.CFrame.VectorToObjectSpace(this.Character.Humanoid.MoveDirection),
			);

			let Animation: AnimationTrack | undefined;

			if (Direction.Z < 0) Animation = this.DoubleJumpFront;
			else if (Direction.Z > 0) Animation = this.DoubleJumpBack;

			if (Direction.X < 0) Animation = this.DoubleJumpLeft;
			else if (Direction.X > 0) Animation = this.DoubleJumpRight;

			(Animation ?? this.DoubleJumpFront).Play(0.3, 1, 0.75);

			const Multiplier = math.clamp(
				4.5 -
					((this.Humanoid.WalkSpeed - EMovementSpeeds.Default) /
						(EMovementSpeeds.RunMomentum - EMovementSpeeds.Default)) *
						(4.5 - 2),
				2,
				4.5,
			);

			this.HumanoidRootPart.AssemblyLinearVelocity = new Vector3(
				this.HumanoidRootPart.AssemblyLinearVelocity.X * Multiplier,
				DOUBLEJUMP_FORCE_UP,
				this.HumanoidRootPart.AssemblyLinearVelocity.Z * Multiplier,
			);
		}
	}

	public Stop(speed: number) {
		if (!this.IsJumping) return;
		this.IsJumping = false;
		const Speed = speed ? speed : 0.225;
		this.RunJump1.Stop(Speed);
		this.RunJump2.Stop(Speed);
		this.WalkJump1.Stop(Speed);
		this.WalkJump2.Stop(Speed);
		this.DoubleJumpFront.Stop(Speed);
		this.DoubleJumpLeft.Stop(Speed);
		this.DoubleJumpRight.Stop(Speed);
		if (this.DoubleJumped && this.States.IsGrounded()) this.DoubleJumped = false;
	}
}

export { Default_Hands_Jump, Default_Hands_JumpInfo };
