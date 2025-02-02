/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable roblox-ts/lua-truthiness */
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { ReplicateClient } from "ReplicatedStorage/Classes/Character/ReplicateClient";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SettingsManager } from "./SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { EReplicateResult } from "ReplicatedStorage/Enums/EReplicateResult";
import { ModuleManager } from "./ModuleManager";
import { IReplicateInfo } from "ReplicatedStorage/Interfaces/IReplicateInfo";
import { IReplicateServer } from "ReplicatedStorage/Interfaces/IReplicateServer";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";

const Player = Players.LocalPlayer;
const Camera = Workspace.Camera;

const ReplicateEvent = ReplicatedStorage.WaitForChild("Events")
	.WaitForChild("Combat")
	.WaitForChild("ReplicateEvent") as RemoteEvent;

export class ReplicateManager {
	public static ReplicateHandlerClient(
		rClient: ReplicateClient,
		nameHandler: string,
		selfReplicated: boolean = false,
	): LuaTuple<[CReplicate, EReplicateResult[]]> {
		const ReplicateInfo = ModuleManager.GetReplicateInfo(nameHandler);
		const Result: EReplicateResult[] = [];

		if (
			!ReplicateInfo ||
			(!rClient.Replicated.has(nameHandler) &&
				Tools.VectorDistance(rClient.Character.HumanoidRootPart.Position, Camera.CFrame.Position) >
					(SettingsManager.GetSetting(Player, ESettingsVisual.RenderDistance) as number)) ||
			rClient.Character.IsDestroyed
		)
			return $tuple(undefined!, Result);

		const ReplicateName = ReplicateInfo.ReplicateClass ?? nameHandler;

		if (ReplicateInfo.SelfInit) {
			if (!rClient.ReplicateModules.has(ReplicateName))
				rClient.ReplicateModules.set(
					ReplicateName,
					new (ModuleManager.GetReplicate(ReplicateName))(rClient.Character),
				);
		}

		return this.ReplicateHandler(rClient, nameHandler, ReplicateInfo, ReplicateName, Result, selfReplicated);
	}

	public static ReplicateHandlerServer(
		rServer: IReplicateServer,
		nameHandler: string,
	): LuaTuple<[CReplicate, EReplicateResult[]]> {
		const ReplicateInfo = ModuleManager.GetReplicateInfo(nameHandler);
		const Result: EReplicateResult[] = [];

		if (!ReplicateInfo) return $tuple(undefined!, Result);

		const ReplicateName = ReplicateInfo.ReplicateClass ?? nameHandler;

		return this.ReplicateHandler(rServer, nameHandler, ReplicateInfo, ReplicateName, Result);
	}

	private static ReplicateHandler(
		rClient: ReplicateClient | IReplicateServer,
		nameHandler: string,
		ReplicateInfo: IReplicateInfo,
		ReplicateName: string,
		Result: EReplicateResult[],
		selfReplicated: boolean = false,
	): LuaTuple<[CReplicate, EReplicateResult[]]> {
		const ReplicateClass = rClient.ReplicateModules.get(ReplicateName);
		if (!ReplicateClass) {
			if (rClient.Character.Player) print(2);
			Result.push(EReplicateResult.Stop);
			return $tuple(undefined!, Result);
		}

		const Attributes = rClient.Character.Attributes;

		if (!ReplicateInfo.ReplicateStunned && Attributes.IsStunnedFull()) {
			if (rClient.Character.Player) print(3);
			Result.push(EReplicateResult.Stop);
			return $tuple(ReplicateClass, Result);
		}

		if (ReplicateInfo.Cooldown > 0) {
			const time = tick() - Attributes.TickAnim(ReplicateName);
			if (time < ReplicateInfo.Cooldown) {
				if (rClient.Character.Player) print(4);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}
		}

		const Abilities = rClient.Character.Abilities;
		const Styles = rClient.Character.Styles;
		const Weapons = rClient.Character.Weapons;

		if (ReplicateInfo.AbilityClass) {
			if (!Abilities.Has(ReplicateName)) {
				if (rClient.Character.Player) print(5);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			if (
				!ReplicateInfo.CanOverride &&
				((Attributes.UsingAbility() && Attributes.UsingAbility() !== ReplicateName) || Attributes.UsingStyle())
			) {
				if (rClient.Character.Player) print(6);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			const Weapon = ModuleManager.GetAbilityInfo(ReplicateName)!.Weapon;

			if (!Weapons.Has(Weapon) || !Weapons.IsEquipped(Weapon)) {
				if (rClient.Character.Player) print(7);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			if (ReplicateInfo.CanFeint) {
				Abilities.AbilitiesFeint.add(nameHandler);
				if (ReplicateInfo.HasFeintStop && !rClient.ReplicatesPlayed.has(nameHandler))
					Result.push(EReplicateResult.FeintAbility);
			}
		}

		if (ReplicateInfo.StyleClass) {
			const Split = ReplicateInfo.StyleClass.split("_");
			if (Styles.Style !== Split[0]) {
				if (rClient.Character.Player) print(8);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			if (
				!ReplicateInfo.CanOverride &&
				((Attributes.UsingStyle() && Attributes.UsingStyle() !== Split[2]) || Attributes.UsingAbility())
			) {
				if (rClient.Character.Player) print(9);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			if (!Weapons.Has(Split[1]) || !Weapons.IsEquipped(Split[1])) {
				if (rClient.Character.Player) print(10);
				Result.push(EReplicateResult.Stop);
				return $tuple(ReplicateClass, Result);
			}

			if (ReplicateInfo.CanFeint) {
				Styles.StylesFeint.add(nameHandler);
				if (ReplicateInfo.HasFeintStop && !rClient.ReplicatesPlayed.has(nameHandler))
					Result.push(EReplicateResult.FeintStyle);
			}
		}

		const ReplicatedPlayed = (
			selfReplicated ? (rClient as ReplicateClient).SelfReplicatesPlayed : rClient.ReplicatesPlayed
		) as Set<string>;
		if (!ReplicatedPlayed.has(nameHandler)) {
			ReplicatedPlayed.add(nameHandler);

			Result.push(EReplicateResult.ReplicateOnce);

			if (ReplicateInfo.Sound) Result.push(EReplicateResult.Sound);
		}

		if (RunService.IsClient()) (rClient as ReplicateClient).Replicated.add(nameHandler);
		Result.push(EReplicateResult.Replicate);
		return $tuple(ReplicateClass, Result);
	}

	public static ReplicateAllClients = (characterId: string, replicateName: string, ...args: Array<unknown>) =>
		ReplicateEvent.FireAllClients(characterId, replicateName, ...args);
}
