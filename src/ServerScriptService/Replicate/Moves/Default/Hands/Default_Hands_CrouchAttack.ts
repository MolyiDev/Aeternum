// Imports
import { PhysicsService, Workspace } from "@rbxts/services";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { ECollisionGroup } from "ReplicatedStorage/Enums/ECollisionGroup";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { CrouchAttackInfo } from "ReplicatedStorage/Moves/Default/Hands/Default_Hands_CrouchAttack";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { RagdollManager } from "ServerScriptService/Managers/RagdollManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

// Physics
PhysicsService.RegisterCollisionGroup(ECollisionGroup.CrouchAttack);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.CrouchAttack, ECollisionGroup.CrouchAttack, false);

// Constants
const MOVE_TIME = 0.25;
const MAX_DISTANCE = 6.5;
const MAX_ANGLE = 50;
const TWEEN = new TweenInfo(MOVE_TIME, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

@ReplicateInfo(CrouchAttackInfo)
export class Default_Hands_CrouchAttack implements IReplicateClass {
	public Character: Character;

	public MarkDamage: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;
	}

	public Signal() {
		const Character = this.Character;
		const Model = Character.Model;
		const HumanoidRootPart = Character.HumanoidRootPart;

		const rayParams = new RaycastParams();
		rayParams.FilterDescendantsInstances = [Model];
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;

		const rayResult = Workspace.Raycast(
			HumanoidRootPart.Position,
			HumanoidRootPart.CFrame.LookVector.mul(MAX_DISTANCE),
			rayParams,
		);
		if (!rayResult) return;

		const HitCharacter = CharacterManager.GetCharacter(rayResult.Instance.Parent);
		if (!HitCharacter) return;
		const HitHumanoid = HitCharacter.Humanoid;
		const HitHumanoidRootPart = HitCharacter.HumanoidRootPart;
		if (
			!HitHumanoid ||
			Tools.VectorDistance(HitHumanoidRootPart.Position, HumanoidRootPart.Position) > MAX_DISTANCE
		)
			return;

		const directionToHit = HitHumanoidRootPart.Position.sub(HumanoidRootPart.Position).Unit;

		const hitLookVector = HitHumanoidRootPart.CFrame.LookVector;

		const dotProduct = hitLookVector.Dot(directionToHit);

		const angle = math.deg(math.acos(dotProduct));

		if (angle > MAX_ANGLE) return;

		const HitModel = HitCharacter.Model;

		HitModel.UpperTorso.CollisionGroup = ECollisionGroup.CrouchAttack;
		HitModel.LowerTorso.CollisionGroup = ECollisionGroup.CrouchAttack;
		HitModel.Head.CollisionGroup = ECollisionGroup.CrouchAttack;
		HitHumanoidRootPart.CollisionGroup = ECollisionGroup.CrouchAttack;

		Model.UpperTorso.CollisionGroup = ECollisionGroup.CrouchAttack;
		Model.LowerTorso.CollisionGroup = ECollisionGroup.CrouchAttack;
		Model.Head.CollisionGroup = ECollisionGroup.CrouchAttack;
		HumanoidRootPart.CollisionGroup = ECollisionGroup.CrouchAttack;

		const crouchAttack = Character.Animations.GetAnimation(EAnimations.Default_Hands_CrouchAttack);
		const receiveCrouchAttack = HitCharacter.Animations.GetAnimation(EAnimations.Default_Hands_ReceiveCrouchAttack);

		const newPosition = HitHumanoidRootPart.CFrame.Position.sub(HitHumanoidRootPart.CFrame.LookVector.mul(2.5));
		const targetPosition = new CFrame(newPosition, newPosition.add(HitHumanoidRootPart.CFrame.LookVector));
		Tools.TweenPlay(HumanoidRootPart, TWEEN, { CFrame: targetPosition });

		StunManager.Stun(HitCharacter, 3);
		StunManager.Stun(Character, 2.8, EStunType.Partial);
		crouchAttack.Play(MOVE_TIME);
		receiveCrouchAttack.Play(MOVE_TIME);

		const Butler = Character.Butler;
		const HitButler = HitCharacter.Butler;

		this.MarkDamage = Butler.Connect(crouchAttack.GetMarkerReachedSignal("Damage"), (damage) =>
			DamageManager.Damage(HitCharacter, tonumber(damage) as number),
		);

		const MarkerRagdoll = HitButler.Connect(receiveCrouchAttack.GetMarkerReachedSignal("Ragdoll"), () =>
			RagdollManager.RagdollCharacter(HitCharacter, 3),
		);

		const HitStop = HitButler.Once(receiveCrouchAttack.Stopped, () => {
			HitButler.RemoveList(MarkerRagdoll, HitStop);

			Model.UpperTorso.CollisionGroup = ECollisionGroup.Player;
			Model.LowerTorso.CollisionGroup = ECollisionGroup.Player;
			Model.Head.CollisionGroup = ECollisionGroup.Player;
			HitHumanoidRootPart.CollisionGroup = ECollisionGroup.Player;
		});
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		const Character = this.Character;
		const HumanoidRootPart = Character.HumanoidRootPart;
		const Model = this.Character.Model;
		const Butler = Character.Butler;

		Butler.Remove(this.MarkDamage);

		Model.UpperTorso.CollisionGroup = ECollisionGroup.Player;
		Model.LowerTorso.CollisionGroup = ECollisionGroup.Player;
		Model.Head.CollisionGroup = ECollisionGroup.Player;
		HumanoidRootPart.CollisionGroup = ECollisionGroup.Player;

		const Attributes = this.Character.Attributes;

		Attributes.SetTickAnim(EAnimations.Default_Hands_CrouchAttack, tick());
	}

	public Destroy() {
		this.Character.Butler.Remove(this.MarkDamage);

		this.Character = undefined!;
	}
}
