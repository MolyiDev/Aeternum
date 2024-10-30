// Imports
import Signal from "@rbxts/lemon-signal";
import { Players } from "@rbxts/services";
import { EMovementState } from "shared/Enums/Movement/EMovementState";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Events
const StateChangedSignal = new Signal<(oldState: EMovementState, newState: EMovementState, speed?: number) => void>();

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const Humanoid = Character.Humanoid;

export class StateManager {
	public static State: EMovementState = EMovementState.Idle;
	public static StateChanged = StateChangedSignal;

	private static States: { [key in EMovementState]: boolean } = {
		[EMovementState.Idle]: false,
		[EMovementState.Jumping]: false,
		[EMovementState.Falling]: false,
		[EMovementState.Landing]: false,
		[EMovementState.Walking]: false,
		[EMovementState.Climbing]: false,
		[EMovementState.Running]: false,
		[EMovementState.Sliding]: false,
		[EMovementState.SlidingJump]: false,
		[EMovementState.Crouching]: false,
		[EMovementState.Attacking]: false,
		[EMovementState.Guarding]: false,
		[EMovementState.Blocking]: false,
		[EMovementState.Stunned]: false,
	};

	public static StatesReset = new Set<EMovementState>([EMovementState.Idle, EMovementState.Walking]);

	public static ChangeState(state: EMovementState) {
		StateChangedSignal.Fire(this.State, state);
		this.State = state;
	}

	public static AutoState() {
		let Assigned: EMovementState | undefined;
		for (const stateList of pairs(StateManager.States)) {
			if (stateList[1] && !this.StatesReset.has(stateList[0])) {
				Assigned = stateList[0];
				break;
			}
		}

		if (!Assigned) {
			if (this.IsMoving()) {
				this.States[EMovementState.Walking] = true;
				this.State = EMovementState.Walking;
			} else {
				this.States[EMovementState.Idle] = true;
				this.State = EMovementState.Idle;
			}
		} else this.State = Assigned;
	}

	public static SetState(state: EMovementState, bool: boolean, speed: number | undefined = undefined) {
		if (this.States[state] === bool) return;
		this.States[state] = bool;

		if (bool) {
			StateChangedSignal.Fire(this.State, state, speed);
			this.State = state;
		} else {
			const thisState = this.State;
			this.AutoState();
			StateChangedSignal.Fire(thisState, this.State, speed);
		}
	}

	public static IsInState(state: EMovementState): boolean {
		return this.States[state];
	}

	public static GetState(): EMovementState {
		return this.State;
	}

	public static IsMoving = (): boolean => Humanoid.MoveDirection.Magnitude > 0;
}
