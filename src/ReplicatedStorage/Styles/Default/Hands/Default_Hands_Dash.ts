// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { EDashMode } from "ReplicatedStorage/Enums/Dash/EDashMode";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";
import { EDashDirection } from "ReplicatedStorage/Enums/Dash/EDashDirection";
import { ESettingsControls } from "ReplicatedStorage/Enums/Settings/ESettingsControls";
import { Workspace } from "@rbxts/services";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Dash}`;

const ExcludeStates = new Set<EMovementState>([
	EMovementState.Sliding,
	EMovementState.Jumping,
	EMovementState.Attacking,
	EMovementState.Blocking,
]);

const DASH_COOLDOWN = 2.75;
const DASH_DURATION = 0.5;
const DASH_START_SPEED = 70;
const DASH_END_SPEED = 25;

const Default_Hands_DashInfo = {
	[EAnimations.Default_Hands_AirDashFront]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_AirDashBack]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_AirDashLeft]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_AirDashRight]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DashFront]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DashBack]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DashLeft]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_DashRight]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
	[Style]: {
		Cooldown: DASH_COOLDOWN,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Dash extends CStyle {
	private CanDash: boolean = true;
	private AnimationAirFront: AnimationTrack;
	private AnimationAirBack: AnimationTrack;
	private AnimationAirLeft: AnimationTrack;
	private AnimationAirRight: AnimationTrack;
	private AnimationFront: AnimationTrack;
	private AnimationBack: AnimationTrack;
	private AnimationLeft: AnimationTrack;
	private AnimationRight: AnimationTrack;

	constructor(character: Character) {
		super(character);
		[
			this.AnimationAirFront,
			this.AnimationAirBack,
			this.AnimationAirLeft,
			this.AnimationAirRight,
			this.AnimationFront,
			this.AnimationBack,
			this.AnimationLeft,
			this.AnimationRight,
		] = character.Animations.GetAnimations(
			EAnimations.Default_Hands_AirDashFront,
			EAnimations.Default_Hands_AirDashBack,
			EAnimations.Default_Hands_AirDashLeft,
			EAnimations.Default_Hands_AirDashRight,
			EAnimations.Default_Hands_DashFront,
			EAnimations.Default_Hands_DashBack,
			EAnimations.Default_Hands_DashLeft,
			EAnimations.Default_Hands_DashRight,
		);
	}

	public Destroy() {
		this.CanDash = undefined!;
		this.AnimationFront = undefined!;
		this.AnimationBack = undefined!;
		this.AnimationLeft = undefined!;
		this.AnimationRight = undefined!;

		super.Destroy();
	}

	public Start() {
		if (!this.CanDash || ExcludeStates.has(this.States.State)) return;

		const moveDirection = this.GetDashDirection();
		if (moveDirection === undefined) return;

		this.CanDash = false;
		const dashMode = this.Attributes.IsCameraLocked() ? EDashMode.Locked : EDashMode.Root;

		if (this.States.IsGrounded()) {
			this.Tweens.SetDash({
				Direction: moveDirection,
				Mode: dashMode,
				Time: DASH_DURATION,
				InitialSpeed: DASH_START_SPEED,
				FinalSpeed: DASH_END_SPEED,
				Stun: true,
			});

			this.Tweens.SetCameraFov(ECameraFovs.Dash, DASH_DURATION);
			task.delay(DASH_DURATION * 1.2, () => {
				if (this.Tweens.TargetCameraFov === ECameraFovs.Dash)
					this.Tweens.SetCameraFov(ECameraFovs.Default, 0.25);
			});

			task.delay(DASH_COOLDOWN, () => {
				this.CanDash = true;
			});
		} else {
			this.HumanoidRootPart.AssemblyLinearVelocity = new Vector3(
				this.HumanoidRootPart.AssemblyLinearVelocity.X,
				0,
				this.HumanoidRootPart.AssemblyLinearVelocity.Z,
			);
			this.Tweens.SetDash({
				Direction: moveDirection,
				Mode: dashMode,
				Time: DASH_DURATION * 1.2,
				InitialSpeed: DASH_START_SPEED * 1.2,
				FinalSpeed: DASH_END_SPEED * 1.2,
				Stun: true,
			});

			this.Styles.Stop(EStyleType.Jump, 0.1);
			Workspace.Gravity = -20;

			this.Tweens.SetCameraFov(ECameraFovs.Dash, DASH_DURATION * 1.2);
			task.delay(DASH_DURATION * 1.25, () => {
				Workspace.Gravity = EGlobal.Gravity;
				if (this.Tweens.TargetCameraFov === ECameraFovs.Dash)
					this.Tweens.SetCameraFov(ECameraFovs.Default, 0.25);
			});

			task.delay(DASH_COOLDOWN * 1.55, () => (this.CanDash = true));
		}
	}

	public Stop(): void {
		this.AnimationAirFront.Stop(0.1);
		this.AnimationAirBack.Stop(0.1);
		this.AnimationAirLeft.Stop(0.1);
		this.AnimationAirRight.Stop(0.1);
	}

	public GetDashDirection(): EDashDirection | undefined {
		let direction: EDashDirection | undefined;

		if (this.Controls.IsKeyDown(ESettingsControls.Forward)) {
			direction = EDashDirection.Forward;
			if (this.States.IsGrounded()) this.AnimationFront.Play(0.1);
			else this.AnimationAirFront.Play(0.1);
		}

		if (this.Controls.IsKeyDown(ESettingsControls.Back)) {
			if (direction === EDashDirection.Forward) direction = undefined;
			else {
				if (this.Attributes.IsCameraLocked()) direction = EDashDirection.Back;
				else direction = EDashDirection.Forward;
			}

			if (!this.Attributes.IsCameraLocked()) {
				if (this.States.IsGrounded()) this.AnimationFront.Play(0.1);
				else this.AnimationAirFront.Play(0.1);
			} else {
				if (this.States.IsGrounded()) this.AnimationBack.Play(0.1);
				else this.AnimationAirBack.Play(0.1);
			}
		}

		if (this.Controls.IsKeyDown(ESettingsControls.Left)) {
			switch (direction) {
				case EDashDirection.Forward:
					direction = EDashDirection.ForwardLeft;
					break;
				case EDashDirection.Back:
					direction = EDashDirection.BackLeft;
					break;
				default:
					direction = EDashDirection.Left;
					break;
			}

			if (!this.Attributes.IsCameraLocked()) {
				if (this.States.IsGrounded()) this.AnimationFront.Play(0.1);
				else this.AnimationAirFront.Play(0.1);
			} else {
				if (this.States.IsGrounded()) this.AnimationLeft.Play(0.1);
				else this.AnimationAirLeft.Play(0.1, 1, this.Model.GetAttribute("Animation") as number);
			}
		}

		if (this.Controls.IsKeyDown(ESettingsControls.Right)) {
			switch (direction) {
				case EDashDirection.Forward:
					direction = EDashDirection.ForwardRight;
					break;
				case EDashDirection.ForwardLeft:
					direction = EDashDirection.Forward;
					break;
				case EDashDirection.Back:
					direction = EDashDirection.BackRight;
					break;
				case EDashDirection.BackLeft:
					direction = EDashDirection.Back;
					break;
				case EDashDirection.Left:
					direction = undefined;
					break;
				default:
					direction = EDashDirection.Right;
					break;
			}

			if (!this.Attributes.IsCameraLocked()) {
				if (this.States.IsGrounded()) this.AnimationFront.Play(0.1);
				else this.AnimationAirFront.Play(0.1);
			} else {
				if (this.States.IsGrounded()) this.AnimationRight.Play(0.1);
				else this.AnimationAirRight.Play(0.1, 1, this.Model.GetAttribute("Animation") as number);
			}
		}

		if (direction === undefined) {
			if (this.States.IsGrounded()) this.AnimationBack.Play(0.1);
			else this.AnimationAirBack.Play(0.1);
			return EDashDirection.Back;
		} else return direction;
	}
}

export { Default_Hands_Dash, Default_Hands_DashInfo };
