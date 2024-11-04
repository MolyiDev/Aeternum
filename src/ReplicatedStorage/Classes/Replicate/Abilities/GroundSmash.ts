// Imports
import { RockManager } from "ReplicatedStorage/Managers/RockManager";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { Workspace } from "@rbxts/services";

export class GroundSmash implements IReplicateClass {
	public Character: Character;
	public Height: number;
	public MarkSmash: RBXScriptConnection = undefined!;
	public MarkSmash1: RBXScriptConnection = undefined!;
	public MarkSmash2: RBXScriptConnection = undefined!;
	public MarkSmash3: RBXScriptConnection = undefined!;
	public RayParams: RaycastParams;

	constructor(character: Character) {
		this.Character = character;

		this.Height = 0;

		const rayParams = new RaycastParams();
		rayParams.FilterDescendantsInstances = [character.Model];
		rayParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.RayParams = rayParams;
	}

	Destroy() {
		this.Character.Butler.RemoveList(this.MarkSmash, this.MarkSmash1, this.MarkSmash2, this.MarkSmash3);

		this.Height = undefined!;
		this.Character = undefined!;
		this.MarkSmash = undefined!;
		this.MarkSmash1 = undefined!;
		this.MarkSmash2 = undefined!;
		this.MarkSmash3 = undefined!;
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		if (animName !== EAnimations.GroundSmashIdle) return;

		const rayOrigin = this.Character.HumanoidRootPart.Position;
		const rayDirection = new Vector3(0, -5000, 0);

		const rayResult = Workspace.Raycast(rayOrigin, rayDirection, this.RayParams);
		if (!rayResult) {
			this.Height = 0;
			return;
		}

		this.Height = rayOrigin.sub(rayResult.Position).Magnitude;
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string) {
		const Character = this.Character;
		const Butler = Character.Butler;
		const HumanoidRootPart = Character.HumanoidRootPart;

		switch (animName) {
			case EAnimations.GroundSmash:
				this.MarkSmash1 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash1"), () => {
					const CF = HumanoidRootPart.CFrame;
					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(90), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-90), 0)),
						CF.mul(CFrame.Angles(0, math.rad(180), 0)),
					];

					RockManager.Crater(CF, 0, 0.7, 5, 12, 2, 0.15, true);
					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							2,
							15,
							25,
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

				this.MarkSmash2 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash2"), () => {
					const CF = HumanoidRootPart.CFrame;
					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(140), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-140), 0)),
						CF.mul(CFrame.Angles(0, math.rad(85), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-85), 0)),
					];

					RockManager.Crater(CF, 0, 0.9, 6, 12, 2, 0.15, true);
					RockManager.Crater(CF, 0, 0.8, 12, 20, 3, 0.25, true, 2);
					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							3,
							25,
							35,
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

				this.MarkSmash3 = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () => {
					const CF = HumanoidRootPart.CFrame;
					const Directions = [
						CF,
						CF.mul(CFrame.Angles(0, math.rad(55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-55), 0)),
						CF.mul(CFrame.Angles(0, math.rad(120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(-120), 0)),
						CF.mul(CFrame.Angles(0, math.rad(180), 0)),
					];

					RockManager.Crater(CF, 0, 1.1, 7, 14, 2, 0.15, true);
					RockManager.Crater(CF, 0, 0.9, 14, 22, 2, 0.25, true, 2);
					RockManager.Crater(CF, 0, 0.8, 21, 28, 3, 0.35, true, 3);
					Directions.forEach((direction) => {
						RockManager.RandomTrail(
							direction,
							3.5,
							35,
							45,
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
				this.MarkSmash = Butler.Connect(animTrack.GetMarkerReachedSignal("Smash3"), () => {
					const CF = HumanoidRootPart.CFrame;
					RockManager.Crater(CF, 0, 0.35, 1, 5, 1, 0.05);
					RockManager.Explosion(CF.Position, 0.35, 1, 2, 10);
				});
				break;
		}
	}
}
