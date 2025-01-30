import { RunService } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";

interface TrackerInfo {
	Part: BasePart;
	Time: number;
	UpdateCooldown: number;
}

const WAIT_UNTIL_DISSAPEAR = 1;
const UPDATE_INTERVAL = 0.05;
const Trackers = new Map<string, TrackerInfo>();
let IsChecking = false;

let CheckConnection: RBXScriptConnection | undefined;
let TrackedParts: number;

export class MovementTracker {
	public static MovementChecker(dt: number) {
		TrackedParts = 0;

		Trackers.forEach((trackerInfo, id) => {
			if (!trackerInfo.Part || !trackerInfo.Part.Parent) {
				Trackers.delete(id);
				if (trackerInfo.Part) trackerInfo.Part.Destroy();
				return;
			}

			trackerInfo.UpdateCooldown += dt;

			if (trackerInfo.UpdateCooldown >= UPDATE_INTERVAL) {
				trackerInfo.UpdateCooldown = 0;

				const Velocity = (trackerInfo.Part.Parent as BasePart).AssemblyLinearVelocity;
				if (Velocity.Magnitude > 0.1) {
					const Position = (trackerInfo.Part.Parent as BasePart).Position.sub(
						(trackerInfo.Part.Parent as BasePart).CFrame.LookVector.mul(1.8),
					);
					trackerInfo.Time = 0;
					trackerInfo.Part.Transparency = 0;
					trackerInfo.Part.CFrame = CFrame.lookAt(Position, Position.add(Velocity.Unit.mul(2000)));
				} else {
					if (trackerInfo.Time >= WAIT_UNTIL_DISSAPEAR) {
						trackerInfo.Part.Transparency = 1;
					} else trackerInfo.Time += dt;
				}
			} else
				trackerInfo.Part.Position = (trackerInfo.Part.Parent as BasePart).Position.sub(
					(trackerInfo.Part.Parent as BasePart).CFrame.LookVector.mul(1.8),
				);

			TrackedParts += 1;
		});

		if (TrackedParts === 0 && CheckConnection) {
			CheckConnection.Disconnect();
			IsChecking = false;
		}
	}

	public static TrackMovement(character: Character) {
		if (Trackers.has(character.CharacterId)) return;
		const partVisualizer = new Instance("Part", character.HumanoidRootPart);
		partVisualizer.CanCollide = false;
		partVisualizer.CanTouch = false;
		partVisualizer.CanQuery = false;
		partVisualizer.Massless = true;
		partVisualizer.Anchored = true;
		partVisualizer.Size = new Vector3(0.3, 0.3, 5.5);
		partVisualizer.CFrame = new CFrame(
			character.HumanoidRootPart.Position.sub(character.HumanoidRootPart.CFrame.LookVector.mul(1.8)),
		).mul(CFrame.Angles(0, math.rad(90), 0));
		partVisualizer.Color = Color3.fromRGB(9, 220, 132);

		Trackers.set(character.CharacterId, { Part: partVisualizer, Time: 0, UpdateCooldown: 0 });

		if (!IsChecking) {
			IsChecking = true;
			CheckConnection = RunService.Heartbeat.Connect((dt) => this.MovementChecker(dt));
		}
	}
}
