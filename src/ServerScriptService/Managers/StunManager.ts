/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { EMovementJumps } from "ReplicatedStorage/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "ReplicatedStorage/Enums/Movement/EMovementSpeeds";
import { HaloManager } from "./HaloManager";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const SelfStun = Events.WaitForChild("SelfStun") as RemoteEvent;

// Interfaces
interface StunData {
	Duration: number;
	ChangedConnection?: RBXScriptConnection;
	DiedConnection?: RBXScriptConnection;
	StunType: EStunType;
}

// Constants
const MAX_DURATION = 300;

// Variables
const AnimationsStop = new Map<string, number>([
	[EAnimations.Punch0, 0.25],
	[EAnimations.Punch1, 0.25],
	[EAnimations.Punch2, 0.25],
	[EAnimations.Punch3, 0.25],
	[EAnimations.Block, 0.25],
]);

const Stunned = new Map<Character, StunData>();
let IsChecking = false;

let CheckConnection: RBXScriptConnection | undefined;
let StunnedHumanoids: number;

SelfStun.OnServerEvent.Connect((player: Player, ...args: Array<unknown>) => {
	if (args.size() < 2) return;
	const Duration = args[0];
	const Type = args[1];
	if (Duration !== Duration || Type !== Type) return;
	if (!typeIs(Duration, "number") || !typeIs(Type, "number")) return;
	if (Duration < 0 || Duration > MAX_DURATION) return;
	const Character = CharacterManager.GetCharacter(player.Character);
	if (!Character) return;
	StunManager.Stun(Character, Duration, Type);
});

export class StunManager {
	private static StunChecker(deltaTime: number) {
		StunnedHumanoids = 0;

		Stunned.forEach((data, character) => {
			const humanoid = character?.Humanoid;

			if (!humanoid) {
				Stunned.delete(character);
				return;
			}

			humanoid.WalkSpeed = 0;
			humanoid.JumpPower = 0;
			character.Attributes.SetAutoRotate(false);

			if (data.Duration <= 0) this.UnStun(character, data);
			else data.Duration -= deltaTime;

			StunnedHumanoids += 1;
		});

		if (StunnedHumanoids === 0 && CheckConnection) {
			CheckConnection.Disconnect();
			IsChecking = false;
		}
	}

	public static Stun(character: Character, duration: number, stunType: number = EStunType.Default) {
		const Humanoid = character.Humanoid;
		if (!Humanoid || Humanoid.Health <= 0) return;

		const Attributes = character.Attributes;

		let stunData = Stunned.get(character);

		if (stunData) {
			stunData.Duration = duration;
			if (stunType === EStunType.Partial) {
				HaloManager.ChangeColor(Humanoid, Color3.fromRGB(20, 120, 150));
				Attributes.SetStunnedPartial(true);
			} else {
				HaloManager.ChangeColor(Humanoid, Color3.fromRGB(255, 0, 0));
				Attributes.SetStunnedFull(true);
			}
			return;
		}

		if (stunType !== EStunType.Partial) {
			const animator = Humanoid.FindFirstChild("Animator") as Animator;
			if (animator) {
				for (const animation of animator.GetPlayingAnimationTracks()) {
					const stopNumber = AnimationsStop.get(Tools.IdToName(animation.Animation!.AnimationId));
					if (!stopNumber) continue;
					animation.Stop(stopNumber);
				}
			}

			HaloManager.ChangeColor(Humanoid, Color3.fromRGB(255, 0, 0));
			Attributes.SetStunnedFull(true);
		} else {
			HaloManager.ChangeColor(Humanoid, Color3.fromRGB(20, 120, 150));
			Attributes.SetStunnedPartial(true);
		}

		Humanoid.WalkSpeed = 0;
		Humanoid.JumpPower = 0;
		Attributes.SetAutoRotate(false);

		stunData = {
			Duration: duration,
			StunType: stunType,
		};
		Stunned.set(character, stunData);

		const Butler = character.Butler;

		stunData.ChangedConnection = Butler.Connect(Humanoid.Changed as RBXScriptSignal, () => {
			Humanoid.WalkSpeed = 0;
			Humanoid.JumpPower = 0;
			Attributes.SetAutoRotate(false);
		});

		stunData.DiedConnection = Butler.Connect(Humanoid.AncestryChanged, () => this.UnStun(character, stunData));

		if (!IsChecking) {
			IsChecking = true;
			CheckConnection = RunService.Heartbeat.Connect((deltaTime) => this.StunChecker(deltaTime));
		}
	}

	public static UnStun(character: Character, data: StunData | undefined = Stunned.get(character)) {
		if (!data) return;
		const Humanoid = character.Humanoid;
		const Attributes = character.Attributes;
		const Butler = character.Butler;

		if (data.ChangedConnection) Butler.Remove(data.ChangedConnection);
		if (data.DiedConnection) Butler.Remove(data.DiedConnection);

		if (Humanoid && Humanoid.Health > 0) {
			Humanoid.WalkSpeed = EMovementSpeeds.Default;
			Humanoid.JumpPower = EMovementJumps.Default;
		}

		Attributes.SetAutoRotate(true);

		Attributes.SetStunnedFull(false);
		Attributes.SetStunnedPartial(false);
		Stunned.delete(character);

		HaloManager.DefaultColor(Humanoid);
	}
}
