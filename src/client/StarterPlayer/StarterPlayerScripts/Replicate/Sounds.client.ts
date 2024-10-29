// Imports
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const AnimationList = new Set<string>([EAnimations.SeriousPunch, EAnimations.ElectricKick, EAnimations.StealthAttack]);

function ReadSoundString(soundString: string) {
	const parts = soundString.split(",");
	const SoundName = parts[0] ?? "";
	const Start = tonumber(parts[1]) ?? 0;
	const Volume = tonumber(parts[2]) ?? 1;
	const Speed = tonumber(parts[3]) ?? 1;

	return [SoundName, Start, Volume, Speed];
}

AnimManager.AnimationPlayed.Connect((character, janitor, animName, animTrack) => {
	if (!AnimationList.has(animName)) return;
	const HumanoidRootPart = character.HumanoidRootPart;

	janitor.Add(
		animTrack.GetMarkerReachedSignal("Sound").Connect((soundString?: string) => {
			const [SoundName, Start, Volume, Speed] = ReadSoundString(soundString!);
			const Sound = Tools.SoundNameToSound(SoundName as string);
			const SoundClone = Sound.Clone();
			SoundClone.Parent = HumanoidRootPart;
			SoundClone.TimePosition = Start as number;
			SoundClone.Volume = Volume as number;
			SoundClone.PlaybackSpeed = Speed as number;
			SoundClone.Destroy();
		}),
	);
});
