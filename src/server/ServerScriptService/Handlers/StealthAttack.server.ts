// Imports
import { PhysicsService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { ECollisionGroup } from "shared/Enums/ECollisionGroup";
import { IModel } from "shared/Interfaces/IModel";
import { Tools } from "shared/Libraries/Tools";
import { AttributeManager } from "shared/Managers/AttributeManager";
import { AnimManager } from "../../../shared/Managers/AnimManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { StunManager } from "../Managers/StunManager";
import { EStunType } from "shared/Enums/EStunType";
import { RagdollManager } from "../Managers/RagdollManager";
import { DamageManager } from "../Managers/DamageManager";
import { CharacterManager } from "shared/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const StealthAttackEvent = Events.WaitForChild(ECollisionGroup.StealthAttack) as RemoteEvent;

// Constants
const MOVE_TIME = 0.2;
const STEALTHATTACK_CD = 6.5;
const MAX_DISTANCE = 6.5;
const MAX_ANGLE = 50;
const TWEEN = new TweenInfo(MOVE_TIME, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

// Variables
PhysicsService.RegisterCollisionGroup(ECollisionGroup.StealthAttack);
PhysicsService.CollisionGroupSetCollidable(ECollisionGroup.StealthAttack, ECollisionGroup.StealthAttack, false);

StealthAttackEvent.OnServerEvent.Connect((player: Player) => {
	const character = player.Character as IModel;
	const humanoid = character?.Humanoid;
	if (!humanoid || humanoid.Health <= 0) return;

	const SATime = tick() - AttributeManager.TickAttackStealth(character);
	if (SATime < STEALTHATTACK_CD) return;
	AttributeManager.SetTickAttackStealth(character, tick());

	const humanoidRootPart = character.HumanoidRootPart;

	const rayParams = new RaycastParams();
	rayParams.FilterDescendantsInstances = [character];
	rayParams.FilterType = Enum.RaycastFilterType.Exclude;

	const rayResult = Workspace.Raycast(
		humanoidRootPart.Position,
		humanoidRootPart.CFrame.LookVector.mul(MAX_DISTANCE),
		rayParams,
	);
	if (!rayResult) return;

	const hitCharacter = rayResult.Instance.Parent as IModel;
	if (!hitCharacter.HasTag("Character")) return;
	const hitHumanoid = hitCharacter?.Humanoid;
	const hitHumanoidRootPart = hitCharacter?.HumanoidRootPart;
	if (!hitHumanoid || Tools.VectorDistance(hitHumanoidRootPart.Position, humanoidRootPart.Position) > MAX_DISTANCE)
		return;

	const directionToHit = hitHumanoidRootPart.Position.sub(humanoidRootPart.Position).Unit;

	const hitLookVector = hitHumanoidRootPart.CFrame.LookVector;

	const dotProduct = hitLookVector.Dot(directionToHit);

	const angle = math.deg(math.acos(dotProduct));

	if (angle > MAX_ANGLE) return;

	hitCharacter.UpperTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	hitCharacter.LowerTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	hitCharacter.Head.CollisionGroup = ECollisionGroup.StealthAttack;
	hitHumanoidRootPart.CollisionGroup = ECollisionGroup.StealthAttack;

	character.UpperTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	character.LowerTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	character.Head.CollisionGroup = ECollisionGroup.StealthAttack;
	humanoidRootPart.CollisionGroup = ECollisionGroup.StealthAttack;

	const stealthAttack = AnimManager.GetAnimation(character, EAnimations.StealthAttack);
	const receiveStealthAttack = AnimManager.GetAnimation(hitCharacter, EAnimations.ReceiveStealthAttack);

	const newPosition = hitHumanoidRootPart.CFrame.Position.sub(hitHumanoidRootPart.CFrame.LookVector.mul(2.5));
	const targetPosition = new CFrame(newPosition, newPosition.add(hitHumanoidRootPart.CFrame.LookVector));
	Tools.TweenPlay(humanoidRootPart, TWEEN, { CFrame: targetPosition });

	StunManager.Stun(hitCharacter, 3);
	StunManager.Stun(character, 2.8, EStunType.Partial);
	stealthAttack.Play(MOVE_TIME);
	receiveStealthAttack.Play(MOVE_TIME);

	const janitor = CharacterManager.GetCharacterJanitor(character);
	const hitJanitor = CharacterManager.GetCharacterJanitor(character);

	const markerDamage = janitor.Add(
		stealthAttack
			.GetMarkerReachedSignal("Damage")
			.Connect((damage) => DamageManager.Damage(hitCharacter, tonumber(damage) as number)),
	);

	janitor.Add(
		stealthAttack.Stopped.Once(() => {
			markerDamage.Disconnect();

			character.UpperTorso.CollisionGroup = ECollisionGroup.Player;
			character.LowerTorso.CollisionGroup = ECollisionGroup.Player;
			character.Head.CollisionGroup = ECollisionGroup.Player;
			humanoidRootPart.CollisionGroup = ECollisionGroup.Player;
		}),
	);

	const markerRagdoll = hitJanitor.Add(
		receiveStealthAttack
			.GetMarkerReachedSignal("Ragdoll")
			.Connect(() => RagdollManager.RagdollCharacter(hitCharacter, 3)),
	);

	hitJanitor.Add(
		receiveStealthAttack.Stopped.Once(() => {
			markerRagdoll.Disconnect();

			hitCharacter.UpperTorso.CollisionGroup = ECollisionGroup.Player;
			hitCharacter.LowerTorso.CollisionGroup = ECollisionGroup.Player;
			hitCharacter.Head.CollisionGroup = ECollisionGroup.Player;
			hitHumanoidRootPart.CollisionGroup = ECollisionGroup.Player;
		}),
	);
});
