// Imports
import { MoveInfo } from "ReplicatedStorage/Attributes/MoveInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IMove } from "ReplicatedStorage/Interfaces/IMove";
import Collector from "ReplicatedStorage/Libraries/Collector";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const DASH_SPEED = 145;
const DASH_TIME = 0.35;
const Cooldown = 0;

const RunAttackInfo = {
	[EAnimations.Default_Hands_RunAttack]: {
		Move: true,
		Sound: true,
		Cooldown: Cooldown,
	},
};

@MoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.RunAttack}`, {
	Cooldown: Cooldown,
	Damage: [20],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 0,
	Blockeable: true,
	Dasheable: true,
})
class Default_Hands_RunAttack implements IMove {
	private Character: Character;
	private Animation: AnimationTrack;

	constructor(character: Character) {
		this.Character = character;
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_RunAttack);
	}

	public Start() {
		const Character = this.Character;
		const Humanoid = Character.Humanoid;

		if (
			Character.Attributes.IsStunned() ||
			Humanoid.WalkSpeed < EMovementSpeeds.Run ||
			!Tools.IsTouchingGround(Humanoid, true)
		)
			return;

		const MoveDirection = Humanoid.MoveDirection;
		const HumanoidRootPart = Character.HumanoidRootPart;

		const dashImpulse = Tools.IsTouchingGround(Humanoid, true)
			? MoveDirection.mul(DASH_SPEED * HumanoidRootPart.AssemblyMass)
			: MoveDirection.mul((DASH_SPEED / 2.25) * HumanoidRootPart.AssemblyMass);

		HumanoidRootPart.ApplyImpulse(dashImpulse);

		/*const velocity = new Instance("BodyVelocity", this.Character.HumanoidRootPart);
		velocity.MaxForce = new Vector3(math.huge, math.huge, math.huge);
		velocity.Velocity = this.Character.HumanoidRootPart.CFrame.LookVector.mul(55);

		Collector.AddItem(velocity, 1.2);*/

		const t = tick() + DASH_TIME;
		while (tick() < t) {
			HumanoidRootPart.AssemblyLinearVelocity;
		}

		this.Character.Attributes.SelfStun(0.75, EStunType.Partial);
		this.Animation.Play(0.2, 1, 1.7);
	}

	public Destroy() {
		this.Character = undefined!;
		this.Animation = undefined!;
	}
}

export { Default_Hands_RunAttack, RunAttackInfo };
