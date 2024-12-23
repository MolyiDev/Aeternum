// Imports
import { RunService } from "@rbxts/services";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { Character } from "ReplicatedStorage/Classes/Character";

// Variables
let IsChecking = false;

let CheckConnection: RBXScriptConnection | undefined;
let RagdollHumanoids: number;

export class RagdollManager {
	private static ActiveRagdolls = new Map<Character, number>();

	private static RagdollChecker(deltaTime: number) {
		RagdollHumanoids = 0;

		this.ActiveRagdolls.forEach((duration, character) => {
			if (duration <= 0) this.UnRagdollCharacter(character);
			else this.ActiveRagdolls.set(character, (duration -= deltaTime));

			RagdollHumanoids += 1;
		});

		if (RagdollHumanoids === 0 && CheckConnection) {
			CheckConnection.Disconnect();
			IsChecking = false;
		}
	}

	public static UnRagdollCharacter(character: Character) {
		if (!this.ActiveRagdolls.has(character)) return;
		if (!character) {
			this.ActiveRagdolls.delete(character);
			return;
		}
		const Attributes = character.Attributes;
		const Humanoid = character.Humanoid;
		const Model = character.Model;

		Attributes.SetIsRagdoll(false);
		Attributes.SetAutoRotate(true);
		Humanoid.PlatformStand = false;
		Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);

		this.ActiveRagdolls.delete(character);

		for (const animConst of Model.GetDescendants()) {
			if (!animConst.IsA("AnimationConstraint") || animConst.Name === "Root") continue;

			animConst.Enabled = true;
		}
	}

	public static RagdollCharacter(character: Character, duration: number) {
		StunManager.Stun(character, duration);

		if (this.ActiveRagdolls.has(character)) {
			this.ActiveRagdolls.set(character, duration);
			return;
		}

		const Attributes = character.Attributes;
		const Humanoid = character.Humanoid;
		const Model = character.Model;

		Attributes.SetIsRagdoll(true);
		Attributes.SetAutoRotate(false);
		Humanoid.PlatformStand = true;
		Humanoid.ChangeState(Enum.HumanoidStateType.Physics);

		for (const animConst of Model.GetDescendants()) {
			if (!animConst.IsA("AnimationConstraint") || animConst.Name === "Root") continue;

			animConst.Enabled = false;
		}

		this.ActiveRagdolls.set(character, duration);

		if (!IsChecking) {
			IsChecking = true;
			CheckConnection = RunService.Heartbeat.Connect((deltaTime) => this.RagdollChecker(deltaTime));
		}
	}
}
