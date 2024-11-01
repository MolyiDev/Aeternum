import { ElectricKick } from "shared/Classes/Replicate/Abilities/ElectricKick";
import { EAbility } from "../Abilities/EAbility";
import { EAbilityInfo } from "../Abilities/EAbilityInfo";
import { EAnimations } from "../EAnimations";
import { IReplicateInfo } from "shared/Interfaces/IReplicateInfo";
import { SeriousPunch } from "shared/Classes/Replicate/Abilities/SeriousPunch";
import { Dash } from "shared/Classes/Replicate/Dash";
import { Footsteps } from "shared/Classes/Replicate/Footsteps";

export const EReplicateInfo = new Map<EAnimations | string, IReplicateInfo>([
	// Abilities

	[
		EAnimations.ElectricKick,
		{
			Ability: true,
			Cooldown: EAbilityInfo[EAbility.ElectricKick].Cooldown,
			Class: ElectricKick,
		},
	],
	[
		EAnimations.SeriousPunch,
		{
			Ability: true,
			Cooldown: EAbilityInfo[EAbility.SeriousPunch].Cooldown,
			Class: SeriousPunch,
		},
	],

	// Dash

	[
		EAnimations.DashForward,
		{
			Ability: false,
			Cooldown: 0,
			Class: Dash,
		},
	],
	[
		EAnimations.DashBack,
		{
			Ability: false,
			Cooldown: 0,
			Class: Dash,
		},
	],
	[
		EAnimations.DashLeft,
		{
			Ability: false,
			Cooldown: 0,
			Class: Dash,
		},
	],
	[
		EAnimations.DashRight,
		{
			Ability: false,
			Cooldown: 0,
			Class: Dash,
		},
	],

	// Footsteps

	[
		EAnimations.WalkForward,
		{
			Ability: false,
			Cooldown: 0,
			Class: Footsteps,
		},
	],
	[
		EAnimations.WalkBack,
		{
			Ability: false,
			Cooldown: 0,
			Class: Footsteps,
		},
	],
	[
		EAnimations.WalkLeft,
		{
			Ability: false,
			Cooldown: 0,
			Class: Footsteps,
		},
	],
	[
		EAnimations.WalkRight,
		{
			Ability: false,
			Cooldown: 0,
			Class: Footsteps,
		},
	],
	[
		EAnimations.Run,
		{
			Ability: false,
			Cooldown: 0,
			Class: Footsteps,
		},
	],
]);
