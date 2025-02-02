// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { RunService, Workspace } from "@rbxts/services";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";

// Variables
const CharactersFolder = Workspace.WaitForChild("Characters");
const HitboxFolder = Workspace.WaitForChild("Hitbox");
const DebrisFolder = Workspace.WaitForChild("Debris");

const Overlap = new OverlapParams();
Overlap.FilterDescendantsInstances = [CharactersFolder, HitboxFolder, DebrisFolder];
Overlap.FilterType = Enum.RaycastFilterType.Exclude;

@ReplicateInfo({
	[EAnimations.Ragdoll]: {
		SelfInit: true,
		ReplicateStunned: true,
	},
})
export class Ragdoll extends CReplicate {
	public RootAttachment: Attachment = new Instance("Attachment", this.Character.HumanoidRootPart);
	public PreSimulation: RBXScriptConnection = undefined!;
	public PrevVelocity: number = 0;

	Destroy() {
		this.Butler.Remove(this.PreSimulation);
		this.RootAttachment.Destroy();

		this.RootAttachment = undefined!;
		this.PreSimulation = undefined!;
		this.PrevVelocity = undefined!;

		super.Destroy();
	}

	public AnimPlay(animTrack: AnimationTrack) {
		let LastCheck = 0;
		this.PreSimulation = this.Butler.Connect(RunService.PreSimulation, () => {
			if (tick() - LastCheck < 0.05) return;
			if (this.PrevVelocity === this.HumanoidRootPart.AssemblyLinearVelocity.Magnitude) return;

			const VelocityVariable = math.abs(
				this.PrevVelocity - this.HumanoidRootPart.AssemblyLinearVelocity.Magnitude,
			);
			if (VelocityVariable > 40) {
				const part = new Instance("Part");
				part.Size = new Vector3(2, 2, 2);
				part.CanCollide = false;
				part.Position = this.HumanoidRootPart.Position;

				const parts = Workspace.GetPartsInPart(part, Overlap);
				part.Destroy();
				if (parts.size() === 0) return;

				RockManager.Crater(
					new CFrame(this.HumanoidRootPart.Position, parts[0].Position),
					0,
					0.5,
					6,
					16,
					2,
					0.05,
					true,
					0.75,
				);
			}

			this.PrevVelocity = this.HumanoidRootPart.AssemblyLinearVelocity.Magnitude;

			LastCheck = tick();
		});

		RockManager.AddAttachment(this.RootAttachment, {
			SubRocks: 0,
			Size: 0.25,
			Radius: 0,
			Distance: 1.4,
			SpawnTime: 0.065,
			UpTime: 0.075,
			LifeTime: 9999,
			Validation: () => this.HumanoidRootPart.AssemblyLinearVelocity.Magnitude > 5,
		});
	}

	public AnimStop(animTrack: AnimationTrack) {
		this.Butler.Remove(this.PreSimulation);
		RockManager.RemoveAttachment(this.RootAttachment);
	}
}
