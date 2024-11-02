// Imports
import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";

// Events
const AnimationPlayOnceSignal = new Signal<[character: Character, animName: string, animTrack: AnimationTrack]>();
const AnimationPlaySignal = new Signal<[character: Character, animName: string, animTrack: AnimationTrack]>();

const AnimsFolder = ReplicatedStorage.WaitForChild("Animations");
const AnimIdToName = new Map<string, string>();

for (const anim of AnimsFolder.GetDescendants()) {
	if (!anim.IsA("Animation")) continue;
	AnimIdToName.set(anim.AnimationId, anim.Name);
}

export class AnimManager {
	public static AnimationPlayOnce = AnimationPlayOnceSignal;
	public static AnimationPlay = AnimationPlaySignal;

	public static IdToName = (name: string) => AnimIdToName.get(name) as string;
}
