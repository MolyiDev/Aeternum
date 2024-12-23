// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";
import { ElectricKickInfo } from "ReplicatedStorage/Abilities/Hands/ElectricKick";
import { ECameraFovs } from "ReplicatedStorage/Enums/ECameraFovs";

@ReplicateInfo(ElectricKickInfo)
export class ElectricKick implements IReplicateClass {
	public Character: Character;
	public SelfMarkRockHand: RBXScriptConnection = undefined!;
	public MarkRockHand: RBXScriptConnection = undefined!;
	public MarkRockDown: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;
	}

	Destroy() {
		this.Character.Butler.RemoveList(this.SelfMarkRockHand, this.MarkRockHand, this.MarkRockDown);

		this.Character = undefined!;
		this.MarkRockHand = undefined!;
		this.MarkRockDown = undefined!;
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Tweens = Character.Tweens;
		const Butler = Character.Butler;

		this.SelfMarkRockHand = Butler.Connect(animTrack.GetMarkerReachedSignal("LegImpact"), () => {
			if (!Attributes.UsingAbility()) return;

			Tweens.GetCameraShaker().ShakeOnce(3, 8, 0, 0.6);
		});
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Model = Character.Model;
		const Butler = Character.Butler;

		this.MarkRockHand = Butler.Connect(animTrack.GetMarkerReachedSignal("RockHand"), () => {
			const CF = Model.RightHand.CFrame;
			RockManager.Crater(CF, 0, 0.35, 2, 6, 1, 0.1);

			if (!Attributes.UsingAbility()) {
				animTrack.Stop(EStopGlobal);
				return;
			}

			RockManager.Explosion(CF.Position, 0.35, 1, 2, 20);

			RockManager.Trail(
				Character.HumanoidRootPart.CFrame,
				10,
				20,
				1,
				Vector3.one,
				2,
				8,
				0.4,
				4,
				false,
				8,
				3,
				0.01,
			);
		});

		this.MarkRockDown = Butler.Connect(animTrack.GetMarkerReachedSignal("RockDown"), () => {
			const CF = Character.HumanoidRootPart.CFrame;
			RockManager.Explosion(CF.Position, 0.45, 1, 3, 30);
			RockManager.Crater(CF, 0, 0.75, 4, 8, 2, 0.25);
			delay(0.05, () => RockManager.Crater(CF, 0, 0.45, 8, 20, 2, 0.25));
		});
	}
}
