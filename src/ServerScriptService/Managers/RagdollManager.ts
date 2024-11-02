// Imports
import { RunService } from "@rbxts/services";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { Character } from "ReplicatedStorage/Classes/Character";

// Interfaces
interface RagdollData {
	Motor6DList: Array<Motor6D>;
	SocketTable: Array<BallSocketConstraint>;
	Attachments: Array<Attachment>;
	Duration: number;
}

// Variables
let IsChecking = false;

let CheckConnection: RBXScriptConnection | undefined;
let RagdollHumanoids: number;

export class RagdollManager {
	private static ActiveRagdolls = new Map<Character, RagdollData>();

	private static RagdollChecker(deltaTime: number) {
		RagdollHumanoids = 0;

		this.ActiveRagdolls.forEach((data, character) => {
			if (data.Duration <= 0) this.UnRagdollCharacter(character);
			else data.Duration -= deltaTime;

			RagdollHumanoids += 1;
		});

		if (RagdollHumanoids === 0 && CheckConnection) {
			CheckConnection.Disconnect();
			IsChecking = false;
		}
	}

	public static UnRagdollCharacter(character: Character) {
		const RagdollData = this.ActiveRagdolls.get(character);
		if (!RagdollData) return;
		const { Motor6DList, SocketTable, Attachments } = RagdollData;
		const Attributes = character.Attributes;
		const Humanoid = character.Humanoid;
		const humanoidRootPart = character.HumanoidRootPart;

		Attributes.SetIsRagdoll(false);
		Attributes.SetAutoRotate(true);
		Humanoid.PlatformStand = false;
		character.HumanoidRootPart.CanCollide = true;

		humanoidRootPart.FindFirstChild("HumWeld")?.Destroy();

		for (const motor6d of Motor6DList) motor6d.Enabled = true;
		for (const socket of SocketTable) socket.Destroy();
		for (const attachment of Attachments) attachment.Destroy();
		for (const part of character.Model.GetChildren()) {
			if (!part.HasTag("Ragdoll")) continue;
			(part as BasePart).CanCollide = false;
		}

		Humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
		this.ActiveRagdolls.delete(character);
	}

	public static RagdollCharacter(character: Character, duration: number) {
		let ragdollData = this.ActiveRagdolls.get(character);
		StunManager.Stun(character, duration);

		if (ragdollData) {
			ragdollData.Duration = duration;
			return;
		}

		const Attributes = character.Attributes;
		const Humanoid = character.Humanoid;
		const HumanoidRootPart = character.HumanoidRootPart;
		const Model = character.Model;

		Attributes.SetIsRagdoll(true);
		Attributes.SetAutoRotate(false);
		character.HumanoidRootPart.CanCollide = false;
		Humanoid.PlatformStand = true;
		Humanoid.ChangeState(Enum.HumanoidStateType.Physics);

		const Motor6DList = new Array<Motor6D>();
		const SocketTable = new Array<BallSocketConstraint>();
		const Attachments = new Array<Attachment>();

		for (const motor6d of Model.GetDescendants()) {
			if (motor6d.HasTag("Ragdoll")) {
				const part = motor6d as BasePart;
				part.CanCollide = true;
				continue;
			}

			if (!motor6d.IsA("Motor6D")) continue;

			const Attachment0 = new Instance("Attachment");
			const Attachment1 = new Instance("Attachment");

			Attachment0.CFrame = motor6d.C0;
			Attachment1.CFrame = motor6d.C1;
			Attachment0.Parent = motor6d.Part0;
			Attachment1.Parent = motor6d.Part1;

			Attachments.push(Attachment0);
			Attachments.push(Attachment1);

			const ballSocketConstraint = new Instance("BallSocketConstraint");
			ballSocketConstraint.Attachment0 = Attachment0;
			ballSocketConstraint.Attachment1 = Attachment1;
			ballSocketConstraint.Parent = motor6d.Parent;
			ballSocketConstraint.TwistLimitsEnabled = true;
			ballSocketConstraint.LimitsEnabled = true;
			SocketTable.push(ballSocketConstraint);

			motor6d.Enabled = false;
			Motor6DList.push(motor6d);
		}

		const weld = new Instance("Weld", HumanoidRootPart);
		weld.Name = "HumWeld";
		weld.Part0 = HumanoidRootPart;
		weld.Part1 = Model.LowerTorso;

		ragdollData = {
			Motor6DList,
			SocketTable,
			Attachments,
			Duration: duration,
		};

		this.ActiveRagdolls.set(character, ragdollData);

		if (!IsChecking) {
			IsChecking = true;
			CheckConnection = RunService.Heartbeat.Connect((deltaTime) => this.RagdollChecker(deltaTime));
		}

		return ragdollData;
	}
}
