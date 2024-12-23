// Imports
import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage, RunService, ServerScriptService, Workspace } from "@rbxts/services";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("NPC");
const NPCAddedEvent = Events.WaitForChild("NPCAdded") as RemoteEvent;
const NPCRemovedEvent = Events.WaitForChild("NPCRemoved") as RemoteEvent;

const NPCAddedSignal = new Signal<(model: Model) => void>();
const NPCRemovedSignal = new Signal<(model: Model) => void>();

// Variables
const NPCFolder = Workspace.WaitForChild("Characters").WaitForChild("NPC") as Folder;

export class NPCManager {
	public static NPCAddedClient = NPCAddedEvent;
	public static NPCRemovedClient = NPCRemovedEvent;

	public static NPCAddedServer = NPCAddedSignal;
	public static NPCRemovedServer = NPCRemovedSignal;

	public static RegisterNPC(model: Model) {
		if (!RunService.IsServer()) return;
		const NPCScripts = ServerScriptService.NPC.Scripts as Folder;

		for (const part of model.GetDescendants()) {
			if (!part.IsA("BasePart")) continue;
			part.SetNetworkOwner(undefined);
		}

		const Scripts = NPCScripts.Clone();
		Scripts.Parent = model;
		for (const scr of Scripts.GetDescendants()) {
			if (!scr.IsA("Script")) continue;
			scr.Enabled = true;
		}

		NPCAddedSignal.Fire(model);
		NPCAddedEvent.FireAllClients(model);

		model.Destroying.Once(() => {
			NPCRemovedSignal.Fire(model);
			NPCRemovedEvent.FireAllClients(model);
		});
	}

	public static GetNPCs = () => NPCFolder.GetChildren() as Model[];
}
