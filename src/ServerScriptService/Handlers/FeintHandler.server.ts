// Imports
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ReplicatedStorage } from "@rbxts/services";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

// Events
const FeintEvent = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat").WaitForChild("Feint") as RemoteEvent;

FeintEvent.OnServerEvent.Connect((player, ...args) => {
	if (args.size() < 1) return;
	const Character = CharacterManager.GetCharacterByModel(player.Character);
	if (!Character || Character.IsDestroyed) return;
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
			Animation.Stop(EGlobal.Feint);
			Attributes.SetUsingAbilityAnim(undefined);
			StunManager.UnStun(Character);
		}
		return;
	}

	const UsingStyle = Attributes.UsingStyleAnim();
	if (!UsingStyle) return;
	const Styles = Character.Styles;
	const ReplicateInfo = ModuleManager.GetReplicateInfo(UsingStyle);
	if (!ReplicateInfo || !ReplicateInfo.CanFeint || !Styles.StylesFeint.has(UsingStyle)) return;
	const Animation = Character.Animations.Animator.GetPlayingAnimationTracks().find(
		(animTrack) => Tools.IdToName(animTrack.Animation!.AnimationId) === UsingStyle,
	);
	if (!Animation) return;
	if (Attributes.UsingStyle() === UsingStyle) Attributes.SetUsingStyle(undefined);
	else {
		Animation.Stop(EGlobal.Feint);
		Attributes.SetUsingStyleAnim(undefined);
		StunManager.UnStun(Character);
	}
});
