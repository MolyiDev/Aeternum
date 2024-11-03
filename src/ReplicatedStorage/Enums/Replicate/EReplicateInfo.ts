import { EAbility } from "../Abilities/EAbility";
import { EAbilityInfo } from "../Abilities/EAbilityInfo";
import { EAnimations } from "../EAnimations";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";

export const EReplicateInfo = new Map<EAnimations | string, IReplicateInfo>([
	// Abilities

	[
		EAnimations.ElectricKick,
		{
			Ability: true,
			Signal: true,
			CanUseStunned: false,
			Cooldown: EAbilityInfo[EAbility.ElectricKick].Cooldown,
		},
	],
	[
		EAnimations.SeriousPunch,
		{
			Ability: true,
			Signal: false,
			CanUseStunned: false,
			Cooldown: EAbilityInfo[EAbility.SeriousPunch].Cooldown,
		},
	],
	[
		EAnimations.GroundSmash,
		{
			Ability: true,
			Signal: false,
			CanUseStunned: false,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		},
	],
	[
		EAnimations.GroundSmashIdle,
		{
			Ability: true,
			Signal: false,
			CanUseStunned: false,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		},
	],
	[
		EAnimations.GroundSmashLand,
		{
			Ability: true,
			Signal: false,
			CanUseStunned: false,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		},
	],

	// Dash

	[
		EAnimations.DashForward,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 2.5,
		},
	],
	[
		EAnimations.DashBack,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 2.5,
		},
	],
	[
		EAnimations.DashLeft,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 2.5,
		},
	],
	[
		EAnimations.DashRight,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 2.5,
		},
	],

	// Footsteps

	[
		EAnimations.WalkForward,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 0,
		},
	],
	[
		EAnimations.WalkBack,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 0,
		},
	],
	[
		EAnimations.WalkLeft,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 0,
		},
	],
	[
		EAnimations.WalkRight,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 0,
		},
	],
	[
		EAnimations.Run,
		{
			Ability: false,
			Signal: false,
			CanUseStunned: false,
			Cooldown: 0,
		},
	],
]);
