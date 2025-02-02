import { Character } from "ReplicatedStorage/Classes/Character";
import { CBase } from "./CBase";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { ReplicateManager } from "ReplicatedStorage/Managers/ReplicateManager";

const Player = Players.LocalPlayer;
const Camera = Workspace.Camera;

const ReplicateEvent = ReplicatedStorage.WaitForChild("Events")
	.WaitForChild("Combat")
	.WaitForChild("ReplicateEvent") as RemoteEvent;

export abstract class CReplicate extends CBase {
	constructor(character: Character) {
		super(character);
	}

	public SelfConstruct?(): void;

	public Fired?(...args: Array<unknown>): void; // Fired from client to server
	public FiredServer?(...args: Array<unknown>): void; // Fired from server to server

	public FiredReplicate?(...args: Array<unknown>): void; // Fired from server to client
	public FiredReplicateOnce?(...args: Array<unknown>): void; // Fired from server to client once

	/**
	 * @todo
	 */
	public FiredReplicateStop?(...args: Array<unknown>): void; // Fired from server to client to stop - NOT IMPLEMENTED -

	public AnimPlay?(animTrack: AnimationTrack, animName: string): void;
	public AnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	public AnimStop?(animTrack: AnimationTrack, animName: string): void;

	public SelfAnimPlay?(animTrack: AnimationTrack, animName: string): void;
	public SelfAnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	public SelfAnimStop?(animTrack: AnimationTrack, animName: string): void;

	public ReplicateAllClients = (characterId: string, replicateName: string, ...args: Array<undefined>) =>
		ReplicateManager.ReplicateAllClients(characterId, replicateName, ...args);

	public SetUsingAbility(replicateName: string | undefined, animName: string | undefined = replicateName) {
		this.Attributes.SetUsingAbility(replicateName);
		this.Attributes.SetUsingAbilityAnim(animName);
	}

	public SetUsingStyle(replicateName: string | undefined, animName: string | undefined = replicateName) {
		this.Attributes.SetUsingStyle(replicateName);
		this.Attributes.SetUsingStyleAnim(animName);
	}

	public SetCooldown(anim: string, cooldown: number) {
		this.Attributes.SetTickAnim(anim, cooldown);
	}

	public IsOnCooldown(anim: string): boolean {
		const ReplicateInfo = ModuleManager.GetReplicateInfo(anim)!;
		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - this.Attributes.TickAnim(anim);
			if (time < ReplicateInfo.Cooldown) return true;
		}

		return false;
	}

	public CanReplicate = () =>
		Tools.VectorDistance(this.Character.HumanoidRootPart.Position, Camera.CFrame.Position) <=
		(SettingsManager.GetSetting(Player, ESettingsVisual.RenderDistance) as number);

	public Destroy() {
		super.Destroy();
	}

	public SelfDestroy(): void {}
}
