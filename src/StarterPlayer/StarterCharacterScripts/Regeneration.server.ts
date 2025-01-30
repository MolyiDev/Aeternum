/* eslint-disable @typescript-eslint/no-require-imports */
import { RunService, ServerScriptService } from "@rbxts/services";
import { EParameter } from "ReplicatedStorage/Enums/EParameter";
import { IRagdollManager } from "ReplicatedStorage/Interfaces/IRagdollManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
const RagdollManager = (
	require(ServerScriptService.WaitForChild("Managers").WaitForChild("RagdollManager") as ModuleScript) as {
		[key: string]: IRagdollManager;
	}
)["RagdollManager"];

const REGENERATION_RATES = {
	[EParameter.Health]: 1,
	[EParameter.Resilience]: 1,
	[EParameter.Numen]: 1,
	[EParameter.Ultimate]: -0.5,
};

const PAUSE_DURATIONS = {
	[EParameter.Health]: 2,
	[EParameter.Resilience]: 2,
	[EParameter.Numen]: 2,
	[EParameter.Ultimate]: 20,
};

const Character = CharacterManager.GetCharacterByModel(script.Parent)!;
const Parameters = Character.Parameters;
const Butler = Character.Butler;

Character.Humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);

const lastModified: Map<EParameter, number> = new Map([
	[EParameter.Health, tick()],
	[EParameter.Ultimate, tick()],
	[EParameter.Resilience, tick()],
	[EParameter.Numen, tick()],
]);
const lastIncrement: Map<EParameter, number> = new Map([
	[EParameter.Health, tick()],
	[EParameter.Ultimate, tick()],
	[EParameter.Resilience, tick()],
	[EParameter.Numen, tick()],
]);

function ShouldRegenerate(parameter: EParameter): boolean {
	const now = tick();
	const lastChange = lastModified.get(parameter) ?? 0;
	const pauseDuration = PAUSE_DURATIONS[parameter] || 0;
	return now - lastChange >= pauseDuration;
}

const Heartbeat = Butler.Connect(RunService.Heartbeat, () => {
	if (Parameters.Dead) {
		Butler.Remove(Heartbeat);
		return;
	}

	const now = tick();

	for (const parameter of [EParameter.Health, EParameter.Resilience, EParameter.Numen, EParameter.Ultimate]) {
		if (!ShouldRegenerate(parameter)) continue;

		const lastTick = lastIncrement.get(parameter) ?? 0;
		if (now - lastTick >= 1) {
			const rate = REGENERATION_RATES[parameter];
			if (parameter === EParameter.Ultimate) {
				const lastChange = lastModified.get(parameter) ?? 0;
				if (now - lastChange >= PAUSE_DURATIONS[EParameter.Ultimate])
					Character.Parameters.Modify(parameter, rate, false);
			} else Character.Parameters.Modify(parameter, rate, false);

			lastIncrement.set(parameter, now);
		}
	}
});

Butler.Connect(Parameters.ParameterChanged, (parameter: EParameter, value: number) => {
	if (parameter === EParameter.Health && value === 0) RagdollManager.RagdollCharacter(Character, 30);
	lastModified.set(parameter, tick());
	if (parameter === EParameter.Ultimate) lastIncrement.set(parameter, tick());
});
