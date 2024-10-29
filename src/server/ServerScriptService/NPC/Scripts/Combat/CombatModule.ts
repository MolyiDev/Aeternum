// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { IModel } from "shared/Interfaces/IModel";
import { AnimManager } from "shared/Managers/AnimManager";
import { AttributeManager } from "shared/Managers/AttributeManager";

// Variables
const Character = script.Parent!.Parent!.Parent as IModel;

const [Punch0, Punch1, Punch2, Punch3] = AnimManager.GetAnimations(
	Character,
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
);

const PUNCH_TIMEOUT = 2;

let CanPunch = true;
const CanFeint = false;
let CurrentPunch = 0;
let LastPunchTime = tick();

interface PunchConfig {
	Animation: AnimationTrack;
	PunchCooldown: number;
}

const Punches = new Map<number, PunchConfig>([
	[
		0,
		{
			Animation: Punch0,
			PunchCooldown: 0.42,
		},
	],
	[
		1,
		{
			Animation: Punch1,
			PunchCooldown: 0.36,
		},
	],
	[
		2,
		{
			Animation: Punch2,
			PunchCooldown: 0.32,
		},
	],
	[
		3,
		{
			Animation: Punch3,
			PunchCooldown: 1.25,
		},
	],
]);

function ResetPunchIfIdle() {
	task.delay(PUNCH_TIMEOUT, () => {
		if (tick() - LastPunchTime >= PUNCH_TIMEOUT && CurrentPunch !== 0) CurrentPunch = 0;
	});
}

function Attack1() {
	if (!CanPunch || AttributeManager.IsStunnedFull(Character) || AttributeManager.IsBlocking(Character)) return;
	if (CurrentPunch >= Punches.size()) CurrentPunch = 0;

	LastPunchTime = tick();
	ResetPunchIfIdle();

	const PrevPunch = Punches.get(CurrentPunch - 1);
	const NewPunch = Punches.get(CurrentPunch) as PunchConfig;

	CurrentPunch++;
	CanPunch = false;

	if (PrevPunch) PrevPunch.Animation.Stop(0.125);
	NewPunch.Animation.Play(0.125);

	task.wait(NewPunch.PunchCooldown);

	CanPunch = true;
}

export = {
	Punch() {
		Attack1();
	},
};
