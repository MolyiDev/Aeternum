// Imports
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ReplicatedStorage } from "@rbxts/services";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";

// Events
const FeintEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Feint") as RemoteEvent;

FeintEvent.OnServerEvent.Connect((player, ...args) => {
	if (args.size() < 1) return;
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	const FeintObject = args[0] as string;
	if (!FeintObject || !typeIs(FeintObject, "string") || FeintObject !== FeintObject) return;
	const Attributes = Character.Attributes;
	if (Attributes.IsStunnedFull()) return;
	const UsingAbility = Attributes.UsingAbilityAnim();
	if (UsingAbility) {
		const Abilities = Character.Abilities;
		const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingAbility);
		if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Abilities.AbilitiesFeint.has(UsingAbility)) return;
		const Animation = Character.Animations.Animator.GetPlayingAnimationTracks().find(
			(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingAbility,
		);
		if (!Animation) return;
		if (Attributes.UsingAbility() === UsingAbility) Attributes.SetUsingAbility(undefined);
		else {
			Animation.Stop(EStopGlobal);
			Attributes.SetUsingAbilityAnim(undefined);
			StunManager.UnStun(Character);
		}
		return;
	}

	const UsingMove = Attributes.UsingMoveAnim();
	if (!UsingMove) return;
	const Moves = Character.Moves;
	const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingMove);
	if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Moves.MovesFeint.has(UsingMove)) return;
	const Animation = Character.Animations.Animator.GetPlayingAnimationTracks().find(
		(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingMove,
	);
	if (!Animation) return;
	if (Attributes.UsingMove() === UsingMove) Attributes.SetUsingMove(undefined);
	else {
		Animation.Stop(EStopGlobal);
		Attributes.SetUsingMoveAnim(undefined);
		StunManager.UnStun(Character);
	}
});
