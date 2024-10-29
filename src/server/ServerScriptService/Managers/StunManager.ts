// Imports
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { EMovementJumps } from "shared/Enums/Movement/EMovementJumps";
import { EMovementSpeeds } from "shared/Enums/Movement/EMovementSpeeds";
import { HaloManager } from "./HaloManager";
import { EAnimations } from "shared/Enums/EAnimations";
import { Tools } from "shared/Libraries/Tools";
import { EStunType } from "shared/Enums/EStunType";
import { IModel } from "shared/Interfaces/IModel";
import { AttributeManager } from "shared/Managers/AttributeManager";
import { CharacterManager } from "shared/Managers/CharacterManager";

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
const AnimationsStop = new Set<string>([
	EAnimations.Punch0,
	EAnimations.Punch1,
	EAnimations.Punch2,
	EAnimations.Punch3,
	EAnimations.Block,
]);

const Stunned = new Map<IModel, StunData>();
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
	const Character = player.Character as IModel;
	if (!Character) return;
	StunManager.Stun(Character, Duration, Type);
});

export class StunManager {
	private static StunChecker(deltaTime: number) {
		StunnedHumanoids = 0;

		Stunned.forEach((data, character) => {
			if (!character) {
				Stunned.delete(character);
				return;
			}

			const humanoid = character.Humanoid;
			humanoid.WalkSpeed = 0;
			humanoid.JumpPower = 0;
			AttributeManager.SetAutoRotate(character, false);

			if (data.Duration <= 0) this.UnStun(character, data);
			else data.Duration -= deltaTime;

			StunnedHumanoids += 1;
		});

		if (StunnedHumanoids === 0 && CheckConnection) {
			CheckConnection.Disconnect();
			IsChecking = false;
		}
	}

	public static Stun(character: IModel, duration: number, stunType: number = EStunType.Default) {
		const humanoid = character.Humanoid;
		if (!humanoid || humanoid.Health <= 0) return;

		let stunData = Stunned.get(character);

		if (stunData) {
			stunData.Duration = duration;
			if (stunType === EStunType.Partial) {
				HaloManager.ChangeColor(humanoid, Color3.fromRGB(20, 120, 150));
				AttributeManager.SetStunnedPartial(character, true);
			} else {
				HaloManager.ChangeColor(humanoid, Color3.fromRGB(255, 0, 0));
				AttributeManager.SetStunnedFull(character, true);
			}
			return;
		}

		if (stunType !== EStunType.Partial) {
			const animator = humanoid.FindFirstChild("Animator") as Animator;
			if (animator) {
				for (const animation of animator.GetPlayingAnimationTracks()) {
					if (!AnimationsStop.has(Tools.IdAnimToName(animation.Animation!.AnimationId))) continue;
					animation.Stop(0.25);
				}
			}

			HaloManager.ChangeColor(humanoid, Color3.fromRGB(255, 0, 0));
			AttributeManager.SetStunnedFull(character, true);
		} else {
			HaloManager.ChangeColor(humanoid, Color3.fromRGB(20, 120, 150));
			AttributeManager.SetStunnedPartial(character, true);
		}

		humanoid.WalkSpeed = 0;
		humanoid.JumpPower = 0;
		AttributeManager.SetAutoRotate(character, false);

		stunData = {
			Duration: duration,
			StunType: stunType,
		};
		Stunned.set(character, stunData);

		const janitor = CharacterManager.GetCharacterJanitor(character);

		stunData.ChangedConnection = janitor.Add(
			(humanoid.Changed as RBXScriptSignal).Connect(() => {
				humanoid.WalkSpeed = 0;
				humanoid.JumpPower = 0;
				AttributeManager.SetAutoRotate(character, false);
			}),
		);

		stunData.DiedConnection = janitor.Add(humanoid.AncestryChanged.Connect(() => this.UnStun(character, stunData)));

		if (!IsChecking) {
			IsChecking = true;
			CheckConnection = RunService.Heartbeat.Connect((deltaTime) => this.StunChecker(deltaTime));
		}
	}

	public static UnStun(character: IModel, data: StunData) {
		const humanoid = character.Humanoid;
		data.ChangedConnection?.Disconnect();
		data.DiedConnection?.Disconnect();

		humanoid.WalkSpeed = EMovementSpeeds.Default;
		humanoid.JumpPower = EMovementJumps.Default;
		AttributeManager.SetAutoRotate(character, true);

		AttributeManager.SetStunnedFull(character, false);
		AttributeManager.SetStunnedPartial(character, false);
		Stunned.delete(character);

		HaloManager.DefaultColor(humanoid);
	}
}
