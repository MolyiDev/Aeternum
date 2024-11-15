// Imports
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { DamageManager } from "../Managers/DamageManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { HitboxManager } from "../Managers/HitboxManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ReplicatedStorage } from "@rbxts/services";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";

// Events
const FeintEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Feint") as RemoteEvent;

// Constants
const PARRY_TIME = 0.2;

// Variables
const AnimationList = new Set<string>([
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
	EAnimations.HeavyPunch,
]);

const UnParryiableAttacks = new Set<string>([]);
const UnBlockableAttacks = new Set<string>([]);

FeintEvent.OnServerEvent.Connect((player, ...args) => {
	if (args.size() === 0) return;
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const Ability = args[0] as string;
	if (!Ability || !typeIs(Ability, "string") || Ability !== Ability) return;
	const Attributes = Character.Attributes;
	if (Attributes.IsStunnedFull()) return;
	const Abilities = Character.Abilities;
	const UsingAbility = Attributes.UsingAbilityAnim();
	if (!UsingAbility) return;
	const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingAbility);
	if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Abilities.AbilitiesFeint.get(UsingAbility)) return;
	const AnimAbility = Character.Animations.Animator.GetPlayingAnimationTracks().find(
		(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingAbility,
	);
	if (!AnimAbility) return;
	if (Attributes.UsingAbility() === UsingAbility) Attributes.SetUsingAbility(undefined);
	else {
		AnimAbility.Stop(0.15);
		Attributes.SetUsingAbilityAnim(undefined);
		StunManager.UnStun(Character);
	}
});

CharacterManager.AddedCharacter.Connect((character) => {
	const Butler = character.Butler;
	const Model = character.Model;
	const Attributes = character.Attributes;
	const Humanoid = character.Humanoid;
	const HumanoidRootPart = character.HumanoidRootPart;
	const Animator = Humanoid.WaitForChild("Animator") as Animator;

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [Model];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	Butler.Connect(Animator.AnimationPlayed, (animationTrack: AnimationTrack) => {
		const animName = Tools.IdToName(animationTrack.Animation!.AnimationId);
		if (!AnimationList.has(animName) || Attributes.IsStunnedFull()) return;

		const CharactersDamaged: Character[] = [];

		const Marker = Butler.Connect(animationTrack.GetMarkerReachedSignal("Damage"), () => {
			HitboxManager.Create(
				new Vector3(4.5, 5.5, 3.5),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -5)),
				0.15,
				true,
				overlapParams,
				(part: Part) => {
					const hitCharacter = CharacterManager.GetCharacter(part.Parent);
					if (!hitCharacter || CharactersDamaged.includes(hitCharacter)) return;
					CharactersDamaged.push(hitCharacter);

					const hitHumanoid = hitCharacter.Humanoid;
					if (!hitHumanoid) return;

					const hitAttributes = hitCharacter.Attributes;
					if (hitAttributes.IsDashing()) return;

					let Damage = 10;

					if (hitAttributes.IsBlocking()) {
						if (!UnParryiableAttacks.has(animName)) {
							const TickParry = tick() - hitAttributes.TickParry();
							if (TickParry <= PARRY_TIME) {
								hitAttributes.SetTickParry(tick());
								StunManager.Stun(character, 1.5);
								return;
							}
						}

						if (!UnBlockableAttacks.has(animName)) Damage /= 4;
					}

					DamageManager.Damage(hitCharacter, Damage);

					if (animName !== EAnimations.Punch3)
						DamageManager.KnockbackStun(hitCharacter, HumanoidRootPart.CFrame.LookVector.mul(25), 0.2);
					else
						DamageManager.KnockbackRagdoll(
							hitCharacter,
							HumanoidRootPart.CFrame.LookVector.mul(60),
							1.25,
							2,
						);
				},
			);
		});

		const Stop = Butler.Once(animationTrack.Stopped, () => {
			Butler.RemoveList(Marker, Stop);
		});
	});
});
