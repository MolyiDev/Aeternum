// Imports
import { RunService } from "@rbxts/services";
import { IModel } from "shared/Interfaces/IModel";
import { StunManager } from "server/ServerScriptService/Managers/StunManager";
import { AttributeManager } from "shared/Managers/AttributeManager";

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
	private static ActiveRagdolls = new Map<IModel, RagdollData>();

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

	public static UnRagdollCharacter(character: IModel) {
		const ragdollData = this.ActiveRagdolls.get(character);
		if (!ragdollData) return;
		const { Motor6DList, SocketTable, Attachments } = ragdollData;
		const humanoid = character.Humanoid;
		const humanoidRootPart = character.HumanoidRootPart;
		AttributeManager.SetIsRagdoll(character, false);

		AttributeManager.SetAutoRotate(character, true);
		humanoid.PlatformStand = false;
		character.PrimaryPart!.CanCollide = true;

		humanoidRootPart.FindFirstChild("HumWeld")?.Destroy();

		for (const motor6d of Motor6DList) motor6d.Enabled = true;
		for (const socket of SocketTable) socket.Destroy();
		for (const attachment of Attachments) attachment.Destroy();
		for (const part of character.GetChildren()) {
			if (!part.HasTag("Ragdoll")) continue;
			(part as BasePart).CanCollide = false;
		}

		humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
		this.ActiveRagdolls.delete(character);
	}

	public static RagdollCharacter(character: IModel, duration: number) {
		const humanoid = character.Humanoid;
		const humanoidRootPart = character.HumanoidRootPart;
		let ragdollData = this.ActiveRagdolls.get(character);
		StunManager.Stun(character, duration);

		if (ragdollData) {
			ragdollData.Duration = duration;
			return;
		}

		AttributeManager.SetIsRagdoll(character, true);
		character.PrimaryPart!.CanCollide = false;
		humanoid.PlatformStand = true;
		AttributeManager.SetAutoRotate(character, false);
		humanoid.ChangeState(Enum.HumanoidStateType.Physics);

		const Motor6DList = new Array<Motor6D>();
		const SocketTable = new Array<BallSocketConstraint>();
		const Attachments = new Array<Attachment>();

		for (const motor6d of character.GetDescendants()) {
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

		const weld = new Instance("Weld", humanoidRootPart);
		weld.Name = "HumWeld";
		weld.Part0 = humanoidRootPart;
		weld.Part1 = character.LowerTorso;

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
