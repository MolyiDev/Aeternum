import { EAbility } from "../Abilities/EAbility";
import { EAbilityInfo } from "../Abilities/EAbilityInfo";
import { EAnimations } from "../EAnimations";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";

const defaultReplicateInfo: IReplicateInfo = {
	Ability: false,
	Move: false,
	Signal: false,
	CanFeint: false,
	HasFeintStop: true,
	CanUseStunned: false,
	Sound: false,
	Cooldown: 0,
	Class: undefined,
};

function ReplicateInfo(overrides: Partial<IReplicateInfo> = {}): IReplicateInfo {
	return { ...defaultReplicateInfo, ...overrides };
}

export const EReplicateInfo = new Map<EAnimations | string, IReplicateInfo>([
	// Abilities

	[
		EAnimations.SeriousPunch,
		ReplicateInfo({
			Ability: true,
			CanFeint: true,
			Sound: true,
			Cooldown: EAbilityInfo[EAbility.SeriousPunch].Cooldown,
		}),
	],
	[
		EAnimations.GroundSmash,
		ReplicateInfo({
			Ability: true,
			CanFeint: true,
			Sound: true,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		}),
	],
	[
		EAnimations.GroundSmashIdle,
		ReplicateInfo({
			Ability: true,
			Sound: true,
			HasFeintStop: false,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		}),
	],
	[
		EAnimations.GroundSmashLand,
		ReplicateInfo({
			Ability: true,
			Sound: true,
			Cooldown: EAbilityInfo[EAbility.GroundSmash].Cooldown,
			Class: "GroundSmash",
		}),
	],

	// Dash

	[
		EAnimations.DashForward,
		ReplicateInfo({
			Sound: true,
			Cooldown: 2.5,
		}),
	],
	[
		EAnimations.DashBack,
		ReplicateInfo({
			Sound: true,
			Cooldown: 2.5,
		}),
	],
	[
		EAnimations.DashLeft,
		ReplicateInfo({
			Sound: true,
			Cooldown: 2.5,
		}),
	],
	[
		EAnimations.DashRight,
		ReplicateInfo({
			Sound: true,
			Cooldown: 2.5,
		}),
	],

	// Walk-Run

	[EAnimations.WalkForward, ReplicateInfo()],
	[EAnimations.WalkForwardLeft, ReplicateInfo()],
	[EAnimations.WalkForwardRight, ReplicateInfo()],
	[EAnimations.WalkBackLeft, ReplicateInfo()],
	[EAnimations.WalkBackRight, ReplicateInfo()],
	[EAnimations.WalkBack, ReplicateInfo()],
	[EAnimations.WalkLeft, ReplicateInfo()],
	[EAnimations.WalkRight, ReplicateInfo()],
	[EAnimations.Run, ReplicateInfo()],
]);
