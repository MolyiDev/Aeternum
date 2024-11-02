// Imports
import { ReplicatedStorage } from "@rbxts/services";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";

// RemoteEvent
const UpdateHead = ReplicatedStorage.WaitForChild("Events").WaitForChild("UpdateHead") as RemoteEvent;

UpdateHead.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
	const character = player.Character as IModel;
	if (!character) return;

	const head = character.Head;
	const torso = character.UpperTorso;
	if (!head || !torso) return;

	const neck = head.FindFirstChild("Neck") as Motor6D;
	const waist = torso.FindFirstChild("Waist") as Motor6D;
	if (!neck) return;

	const newNeckC0 = args[0] as Instance;
	const newWaistC0 = args[1] as Instance;
	if (!newNeckC0) return;
	if (newNeckC0 !== newNeckC0 || newWaistC0 !== newWaistC0) return;
	if (!typeIs(newNeckC0, "CFrame")) return;

	neck.C0 = newNeckC0;
	if (waist && newWaistC0 && typeIs(newWaistC0, "CFrame")) waist.C0 = newWaistC0;
});
