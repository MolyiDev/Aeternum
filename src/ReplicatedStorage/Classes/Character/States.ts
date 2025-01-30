import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { Character } from ".";
import Signal from "@rbxts/lemon-signal";

export class States {
	public Character: Character;

	public State: EMovementState = EMovementState.Idle;
	public StateChanged: Signal<(oldState: EMovementState, newState: EMovementState, speed?: number) => void> =
		new Signal();

	private States: { [key in EMovementState]: boolean } = {
		[EMovementState.Idle]: false,
		[EMovementState.Jumping]: false,
		[EMovementState.Falling]: false,
		[EMovementState.Landing]: false,
		[EMovementState.Walking]: false,
		[EMovementState.Climbing]: false,
		[EMovementState.Running]: false,
		[EMovementState.Sliding]: false,
		[EMovementState.SlidingJump]: false,
		[EMovementState.Attacking]: false,
		[EMovementState.Guarding]: false,
		[EMovementState.Blocking]: false,
		[EMovementState.Stunned]: false,
	};

	public StatesReset = new Set<EMovementState>([EMovementState.Idle, EMovementState.Walking]);

	constructor(character: Character) {
		this.Character = character;
	}

	public Destroy() {
		this.StateChanged.Destroy();
		this.StatesReset.clear();

		this.Character = undefined!;
		this.State = undefined!;
		this.StateChanged = undefined!;
		this.StatesReset = undefined!;
	}

	public ChangeState(state: EMovementState) {
		this.StateChanged.Fire(this.State, state);
		this.State = state;
	}

	public AutoState() {
		let Assigned: EMovementState | undefined;
		for (const stateList of pairs(this.States)) {
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

	public SetState(state: EMovementState, bool: boolean, speed: number | undefined = undefined) {
		if (this.States[state] === bool) return;
		this.States[state] = bool;

		if (bool) {
			this.StateChanged.Fire(this.State, state, speed);
			this.State = state;
		} else {
			const thisState = this.State;
			this.AutoState();
			this.StateChanged.Fire(thisState, this.State, speed);
		}
	}

	public IsInState = (state: EMovementState): boolean => this.States[state];

	public GetState = (): EMovementState => this.State;

	public IsMoving = (): boolean => this.Character.Humanoid.MoveDirection.Magnitude > 0;
	public IsGrounded(): boolean {
		const State = this.Character.Humanoid.GetState();
		return !(
			State === Enum.HumanoidStateType.Freefall ||
			State === Enum.HumanoidStateType.Jumping ||
			State === Enum.HumanoidStateType.FallingDown ||
			State === Enum.HumanoidStateType.Flying ||
			State === Enum.HumanoidStateType.Physics
		);
	}
}
