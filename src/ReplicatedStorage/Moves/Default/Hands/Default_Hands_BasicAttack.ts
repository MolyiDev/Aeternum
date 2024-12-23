// Imports
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";

interface IAttackConfig {
	Animation: AnimationTrack;
	Cooldown: number;
}

const BasicAttackInfo = {
	[EAnimations.Default_Hands_BasicAttack0]: {
		Move: true,
		CanFeint: true,
		Sound: true,
		Cooldown: 0.55,
		Class: "Default_Hands_BasicAttack",
	},
	[EAnimations.Default_Hands_BasicAttack1]: {
		Move: true,
		CanFeint: true,
		Sound: true,
		Cooldown: 0.45,
		Class: "Default_Hands_BasicAttack",
	},
	[EAnimations.Default_Hands_BasicAttack2]: {
		Move: true,
		CanFeint: true,
		Sound: true,
		Cooldown: 0.4,
		Class: "Default_Hands_BasicAttack",
	},
	[EAnimations.Default_Hands_BasicAttack3]: {
		Move: true,
		CanFeint: true,
		Sound: true,
		Cooldown: 1.3,
		Class: "Default_Hands_BasicAttack",
	},
};

const PUNCH_TIMEOUT = 1.75;

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.HeavyAttack}`, {
	Damage: [20],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 0,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_BasicAttack implements IMove {
	private Character: Character;

	private Attacks: Map<number, IAttackConfig>;

	private MarkEnd0: RBXScriptConnection;
	private MarkEnd1: RBXScriptConnection;
	private MarkEnd2: RBXScriptConnection;
	private MarkEnd3: RBXScriptConnection;

	private CanAttack: boolean = true;
	private CurrentPunch: number = 0;
	private LastPunchTime: number = tick();

	constructor(character: Character) {
		this.Character = character;
		const Butler = character.Butler;

		const [Attack0, Attack1, Attack2, Attack3] = character.Animations.GetAnimations(
			EAnimations.Default_Hands_BasicAttack0,
			EAnimations.Default_Hands_BasicAttack1,
			EAnimations.Default_Hands_BasicAttack2,
			EAnimations.Default_Hands_BasicAttack3,
		);

		this.Attacks = new Map([
			[0, { Animation: Attack0, Cooldown: 0.55 }],
			[1, { Animation: Attack1, Cooldown: 0.45 }],
			[2, { Animation: Attack2, Cooldown: 0.4 }],
			[3, { Animation: Attack3, Cooldown: 1.3 }],
		]);

		this.MarkEnd0 = Butler.Connect(Attack0.GetMarkerReachedSignal("End"), () =>
			this.Character.Moves.Get(EMove.Guard).Start(),
		);
		this.MarkEnd1 = Butler.Connect(Attack1.GetMarkerReachedSignal("End"), () =>
			this.Character.Moves.Get(EMove.Guard).Start(),
		);
		this.MarkEnd2 = Butler.Connect(Attack2.GetMarkerReachedSignal("End"), () =>
			this.Character.Moves.Get(EMove.Guard).Start(),
		);
		this.MarkEnd3 = Butler.Connect(Attack3.GetMarkerReachedSignal("End"), () =>
			this.Character.Moves.Get(EMove.Guard).Start(),
		);
	}

	public Start() {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		if (!this.CanAttack || Attributes.IsStunned() || Attributes.IsBlocking()) return;
		if (this.CurrentPunch >= this.Attacks.size()) this.CurrentPunch = 0;

		const States = Character.States;

		this.LastPunchTime = tick();
		this.ResetPunchIfIdle();

		const PrevPunch = this.Attacks.get(this.CurrentPunch - 1);
		const NewAttack = this.Attacks.get(this.CurrentPunch) as IAttackConfig;

		this.CurrentPunch++;
		States.SetState(EMovementState.Attacking, true, 0.1);
		this.CanAttack = false;

		if (PrevPunch) PrevPunch.Animation.Stop(0.125);
		NewAttack.Animation.Play(0.125);

		Character.Tweens.SetSpeed(EMovementSpeeds.Punch, 0.35);

		task.wait(NewAttack.Cooldown);

		Character.Tweens.SetSpeed(EMovementSpeeds.Default, 0.35);
		States.SetState(EMovementState.Attacking, false);

		this.CanAttack = true;
	}

	public ResetPunchIfIdle() {
		task.delay(PUNCH_TIMEOUT, () => {
			if (tick() - this.LastPunchTime >= PUNCH_TIMEOUT && this.CurrentPunch !== 0) this.CurrentPunch = 0;
		});
	}

	public Destroy() {
		this.Character.Butler.RemoveList(this.MarkEnd0, this.MarkEnd1, this.MarkEnd2, this.MarkEnd3);

		this.Character = undefined!;
	}
}

export { Default_Hands_BasicAttack, BasicAttackInfo };
