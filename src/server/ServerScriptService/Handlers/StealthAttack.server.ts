// Imports
import { PhysicsService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { ECollisionGroup } from "shared/Enums/ECollisionGroup";
import { IModel } from "shared/Interfaces/IModel";
import { Tools } from "shared/Libraries/Tools";
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
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const Humanoid = Character.Humanoid;
	if (!Humanoid || Humanoid.Health <= 0) return;
	const Attributes = Character.Attributes;

	const SATime = tick() - Attributes.TickAttackStealth();
	if (SATime < STEALTHATTACK_CD) return;
	Attributes.SetTickAttackStealth(tick());

	const HumanoidRootPart = Character.HumanoidRootPart;
	const Model = Character.Model;

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
	if (!HitHumanoid || Tools.VectorDistance(HitHumanoidRootPart.Position, HumanoidRootPart.Position) > MAX_DISTANCE)
		return;

	const directionToHit = HitHumanoidRootPart.Position.sub(HumanoidRootPart.Position).Unit;

	const hitLookVector = HitHumanoidRootPart.CFrame.LookVector;

	const dotProduct = hitLookVector.Dot(directionToHit);

	const angle = math.deg(math.acos(dotProduct));

	if (angle > MAX_ANGLE) return;

	const HitModel = HitCharacter.Model;

	HitModel.UpperTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	HitModel.LowerTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	HitModel.Head.CollisionGroup = ECollisionGroup.StealthAttack;
	HitHumanoidRootPart.CollisionGroup = ECollisionGroup.StealthAttack;

	Model.UpperTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	Model.LowerTorso.CollisionGroup = ECollisionGroup.StealthAttack;
	Model.Head.CollisionGroup = ECollisionGroup.StealthAttack;
	HumanoidRootPart.CollisionGroup = ECollisionGroup.StealthAttack;

	const stealthAttack = Character.Animations.GetAnimation(EAnimations.StealthAttack);
	const receiveStealthAttack = HitCharacter.Animations.GetAnimation(EAnimations.ReceiveStealthAttack);

	const newPosition = HitHumanoidRootPart.CFrame.Position.sub(HitHumanoidRootPart.CFrame.LookVector.mul(2.5));
	const targetPosition = new CFrame(newPosition, newPosition.add(HitHumanoidRootPart.CFrame.LookVector));
	Tools.TweenPlay(HumanoidRootPart, TWEEN, { CFrame: targetPosition });

	StunManager.Stun(HitCharacter, 3);
	StunManager.Stun(Character, 2.8, EStunType.Partial);
	stealthAttack.Play(MOVE_TIME);
	receiveStealthAttack.Play(MOVE_TIME);

	const Butler = Character.Butler;
	const HitButler = HitCharacter.Butler;

	const MarkerDamage = Butler.Connect(stealthAttack.GetMarkerReachedSignal("Damage"), (damage) =>
		DamageManager.Damage(HitCharacter, tonumber(damage) as number),
	);

	const Stop = Butler.Once(stealthAttack.Stopped, () => {
		Butler.RemoveList(MarkerDamage, Stop);

		Model.UpperTorso.CollisionGroup = ECollisionGroup.Player;
		Model.LowerTorso.CollisionGroup = ECollisionGroup.Player;
		Model.Head.CollisionGroup = ECollisionGroup.Player;
		HumanoidRootPart.CollisionGroup = ECollisionGroup.Player;
	});

	const MarkerRagdoll = HitButler.Connect(receiveStealthAttack.GetMarkerReachedSignal("Ragdoll"), () =>
		RagdollManager.RagdollCharacter(HitCharacter, 3),
	);

	const HitStop = HitButler.Once(receiveStealthAttack.Stopped, () => {
		HitButler.RemoveList(MarkerRagdoll, HitStop);

		Model.UpperTorso.CollisionGroup = ECollisionGroup.Player;
		Model.LowerTorso.CollisionGroup = ECollisionGroup.Player;
		Model.Head.CollisionGroup = ECollisionGroup.Player;
		HitHumanoidRootPart.CollisionGroup = ECollisionGroup.Player;
	});
});
