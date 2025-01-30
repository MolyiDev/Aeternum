// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Workspace } from "@rbxts/services";
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { GroundSmashInfo } from "ReplicatedStorage/Abilities/Hands/GroundSmash";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";

const MaxRocks = 16;
const MaxSize = 1.3;

@ReplicateInfo(GroundSmashInfo)
export class GroundSmash extends CReplicate {
	public Height: number = 0;
	public SelfMarkSmash1: RBXScriptConnection = undefined!;
	public SelfMarkSmash2: RBXScriptConnection = undefined!;
	public SelfMarkSmash3: RBXScriptConnection = undefined!;
	public MarkSmash: RBXScriptConnection = undefined!;
	public MarkSmash1: RBXScriptConnection = undefined!;
	public MarkSmash2: RBXScriptConnection = undefined!;
	public MarkSmash3: RBXScriptConnection = undefined!;
	public VectorForce: VectorForce = undefined!;
	public VectorAttachment: Attachment = undefined!;
	public RayParams: RaycastParams = new RaycastParams();

	constructor(character: Character) {
		super(character);

		this.RayParams.AddToFilter(character.Model);
		this.RayParams.FilterType = Enum.RaycastFilterType.Exclude;
	}

	public SelfConstruct(): void {
		const VectorForce = new Instance("VectorForce", this.HumanoidRootPart);
		const Attachment = this.HumanoidRootPart.FindFirstChild("RootAttachment")!.Clone() as Attachment;
		Attachment.Parent = this.HumanoidRootPart;
		VectorForce.Attachment0 = Attachment;
		VectorForce.Enabled = false;
		this.VectorForce = VectorForce;
		this.VectorAttachment = Attachment;
	}

	Destroy() {
		this.Butler.RemoveList(
			this.SelfMarkSmash1,
			this.SelfMarkSmash2,
			this.SelfMarkSmash3,
			this.MarkSmash,
			this.MarkSmash1,
			this.MarkSmash2,
			this.MarkSmash3,
		);

		this.Height = undefined!;
		this.SelfMarkSmash1 = undefined!;
		this.SelfMarkSmash2 = undefined!;
		this.SelfMarkSmash3 = undefined!;
		this.MarkSmash = undefined!;
		this.MarkSmash1 = undefined!;
		this.MarkSmash2 = undefined!;
		this.MarkSmash3 = undefined!;
		this.RayParams = undefined!;

		super.Destroy();
	}

	public SelfDestroy(): void {
		this.VectorForce.Destroy();
		this.VectorAttachment.Destroy();

		this.VectorForce = undefined!;
		this.VectorAttachment = undefined!;
	}

	public SelfAnimPlayOnce(animTrack: AnimationTrack, animName: string) {
		switch (animName) {
			case EAnimations.GroundSmash:
				this.SelfMarkSmash1 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash1"), () => {
					if (!this.Attributes.UsingAbility()) return;

					this.Tweens.GetCameraShaker().ShakeOnce(4, 8, 0, 0.6);
				});

				this.SelfMarkSmash2 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash2"), () =>
					this.Tweens.GetCameraShaker().ShakeOnce(6, 8, 0, 0.8),
				);

				this.SelfMarkSmash3 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () =>
					this.Tweens.GetCameraShaker().ShakeOnce(6.5, 6, 0, 1),
				);
				break;
			case EAnimations.GroundSmashIdle:
				this.VectorForce.Enabled = true;
				this.Attributes.SetIgnoreLandStun(true);
				break;
			case EAnimations.GroundSmashLand:
				this.VectorForce.Enabled = false;
				task.delay(1, () => {
					if (this.Attributes) this.Attributes.SetIgnoreLandStun(false);
				});
				break;
		}
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		if (animName !== EAnimations.GroundSmashIdle) return;

		const rayOrigin = this.Character.HumanoidRootPart.Position;

		const rayResult = Workspace.Raycast(rayOrigin, new Vector3(0, -5000, 0), this.RayParams);
		if (!rayResult) {
			this.Height = 0;
			return;
		}

		this.Height = rayOrigin.sub(rayResult.Position).Magnitude;
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string) {
		switch (animName) {
			case EAnimations.GroundSmash:
				this.MarkSmash1 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash1"), () => {
					const CF = this.HumanoidRootPart.CFrame;

					if (!this.Attributes.UsingAbility()) {
						animTrack.Stop(EGlobal.Feint);
						RockManager.Crater(CF, 0, 0.55, 4, 8, 1, 0.15, true);
						return;
					}

					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(90), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-90), 0)),
						CF.mul(CFrame.Angles(0, math.rad(180), 0)),
					];

					RockManager.Crater(CF, 0, 0.7, 5, 10, 1, 0.15, true);
					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							2,
							8,
							20,
							2,
							new Vector3(1.25, 1.25, 1.25),
							4,
							0.3,
							0.25,
							3,
							false,
							1,
							2,
							0.01,
						);
					});
					RockManager.Explosion(CF.Position, 0.35, 1, 1, 20);
				});

				this.MarkSmash2 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash2"), () => {
					const CF = this.HumanoidRootPart.CFrame;
					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(140), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-140), 0)),
						CF.mul(CFrame.Angles(0, math.rad(85), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-85), 0)),
					];

					RockManager.Crater(CF, 0, 0.9, 6, 10, 1, 0.15, true);
					RockManager.Crater(CF, 0, 0.8, 12, 18, 2, 0.25, true, 2);

					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							3,
							10,
							30,
							2,
							new Vector3(1.5, 1.5, 1.5),
							4,
							0.55,
							0.3,
							3.5,
							false,
							1.5,
							2.5,
							0.0125,
						);
					});
					RockManager.Explosion(CF.Position, 0.4, 1.25, 2, 30);
				});

				this.MarkSmash3 = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () => {
					const CF = this.HumanoidRootPart.CFrame;
					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(180), 0)),
					];

					RockManager.Crater(CF, 0, 1.1, 7, 12, 3, 0.15, true);
					RockManager.Crater(CF, 0, 0.9, 14, 18, 2, 0.25, true, 2);
					RockManager.Crater(CF, 0, 0.8, 21, 24, 1, 0.35, true, 3);

					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							3.5,
							15,
							35,
							3,
							new Vector3(2, 2, 2),
							6,
							0.7,
							0.35,
							4,
							false,
							2,
							3,
							0.015,
						);
					});
					RockManager.Explosion(CF.Position, 0.5, 1.5, 3, 45);
				});
				break;
			case EAnimations.GroundSmashLand:
				this.MarkSmash = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Smash"), () => {
					if (!this.Attributes.UsingAbility()) {
						animTrack.Stop(EGlobal.Feint);
						return;
					}

					const CF = this.HumanoidRootPart.CFrame;

					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(180), 0)),
					];

					let RocksAmount = math.clamp(this.Height / 6, 4, MaxRocks);
					let SubRocksAmount = math.clamp(RocksAmount / 3, 0, 3);
					let RocksSize = math.clamp(this.Height / 60, 0.45, MaxSize);
					let Radius = 6 + RocksSize * 2;
					const RadiusMultiplier = 6;
					RockManager.Explosion(CF.Position, RocksSize / 2, 1.5, 2, RocksAmount * 2.5);

					for (let i = 0; i < this.Height; i += 20) {
						if (i > 60) break;
						RockManager.Crater(CF, 0, RocksSize, Radius, RocksAmount, SubRocksAmount, 0.2, true);

						RockManager.RandomTrail(
							Directions[math.random(0, Directions.size() - 1)],
							3.5,
							RocksAmount / 1.5,
							RocksAmount * 1.5,
							RocksSize * 1.5,
							new Vector3(RocksSize, RocksSize, RocksSize),
							RocksSize * 2,
							RocksSize / 2,
							0.35,
							4,
							false,
							2,
							3,
							0.015,
						);

						RockManager.RandomTrail(
							Directions[math.random(0, Directions.size() - 1)],
							3.5,
							RocksAmount / 1.5,
							RocksAmount * 2,
							RocksSize * 1.5,
							new Vector3(RocksSize, RocksSize, RocksSize),
							RocksSize * 2,
							RocksSize / 2,
							0.35,
							4,
							false,
							2,
							3,
							0.015,
						);

						Radius += RadiusMultiplier + RocksSize * 2;
						RocksSize /= 1.3;
						SubRocksAmount /= 2;
						RocksAmount *= 1.35;
					}
				});
				break;
		}
	}
}
