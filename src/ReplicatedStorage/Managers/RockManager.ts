// Imports
import { Players, RunService, Workspace } from "@rbxts/services";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { SettingsManager } from "./SettingsManager";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import Collector from "ReplicatedStorage/Libraries/Collector";

// Variables
const Player = Players.LocalPlayer;

const CharactersFolder = Workspace.WaitForChild("Characters");
const DebrisFolder = Workspace.WaitForChild("Debris");
const HitboxFolder = Workspace.WaitForChild("Hitbox");

const CraterInfo = new TweenInfo(5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
const ExplosionInfo = new TweenInfo(0.75, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);

interface IAttachmentRock {
	SubRocks: number;
	Size: number;
	Radius: number;
	Distance: number;
	SpawnTime: number;
	UpTime: number;
	LifeTime: number;
	Validation?: () => boolean;
	CurrentTime: number;
	CurrentLifeTime: number;
}

const AttachmentRocks = new Map<Attachment, IAttachmentRock>();
let HeartbeatConnection: RBXScriptConnection | undefined;

const RayParams = new RaycastParams();
RayParams.FilterDescendantsInstances = [CharactersFolder, DebrisFolder, HitboxFolder];
RayParams.FilterType = Enum.RaycastFilterType.Exclude;
RayParams.IgnoreWater = true;

function RandomAngle() {
	return CFrame.Angles(math.rad(math.random(0, 360)), math.rad(math.random(0, 360)), math.rad(math.random(0, 360)));
}

export class RockManager {
	public static AddAttachment(attachment: Attachment, attachmentRock: Partial<IAttachmentRock>) {
		attachmentRock.CurrentTime = 0;
		attachmentRock.CurrentLifeTime = 0;
		attachmentRock.SubRocks =
			attachmentRock.SubRocks! * ((SettingsManager.GetSetting(Player, ESettingsVisual.SubDebris) as number) ?? 1);
		AttachmentRocks.set(attachment, attachmentRock as IAttachmentRock);
		if (!HeartbeatConnection) HeartbeatConnection = RunService.Heartbeat.Connect((dt) => this.Heartbeat(dt));
	}

	public static RemoveAttachment = (attachment: Attachment) => AttachmentRocks.delete(attachment);

	private static Heartbeat(dt: number) {
		if (AttachmentRocks.size() === 0) {
			HeartbeatConnection!.Disconnect();
			HeartbeatConnection = undefined;
			return;
		}

		AttachmentRocks.forEach((attackmentRock, attachment) => {
			attackmentRock.CurrentTime += dt;
			attackmentRock.CurrentLifeTime += dt;

			if (attackmentRock.CurrentTime >= attackmentRock.SpawnTime) {
				attackmentRock.CurrentTime = 0;

				const ray = Workspace.Raycast(
					attachment.WorldPosition,
					new Vector3(0, -attackmentRock.Distance, 0),
					RayParams,
				);
				if (!ray) return;
				if (attackmentRock.Validation && !attackmentRock.Validation()) return;

				const cf = new CFrame(ray.Position).mul(RandomAngle());

				const Rock = new Instance("Part", DebrisFolder);
				Rock.Size = new Vector3(math.random(4, 8), math.random(3, 6), math.random(3, 6)).mul(
					attackmentRock.Size,
				);
				Rock.CFrame = cf.sub(new Vector3(0, 5, 0));

				Rock.Material = ray.Material;
				Rock.Color = ray.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(ray.Material)
					: ray.Instance.Color;

				Rock.Anchored = true;
				Rock.CanCollide = false;
				Rock.CanQuery = false;
				Rock.CanTouch = false;

				Collector.AddItem(Rock, 10);

				Tools.TweenPlay(
					Rock,
					new TweenInfo(attackmentRock.UpTime, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
					{
						CFrame: cf.sub(new Vector3(0, 0.1, 0)),
					},
				);

				task.delay(math.random(250, 450) / 100, () => {
					Tools.TweenPlay(Rock, CraterInfo, {
						CFrame: Rock.CFrame.sub(new Vector3(0, 10, 0)),
					});
				});

				const randomNumber = math.random(0, attackmentRock.SubRocks);
				if (randomNumber === 0) return;
				for (const j of $range(1, randomNumber)) {
					const rockClone = new Instance("Part", Rock);
					rockClone.CFrame = Rock.CFrame.add(
						new Vector3(math.random(-1, 1) + 0.2, math.random(-1, 1) + 0.2, math.random(-1, 1) + 0.2).mul(
							attackmentRock.Size,
						),
					);
					rockClone.Size = new Vector3(math.random(3, 5), math.random(2, 3), math.random(2, 4)).mul(
						attackmentRock.Size,
					);

					rockClone.Material = Rock.Material;
					rockClone.Color = Rock.Color;

					rockClone.Anchored = false;
					rockClone.CanCollide = false;
					rockClone.CanQuery = false;
					rockClone.CanTouch = false;

					const weld = new Instance("WeldConstraint", Rock);
					weld.Part0 = Rock;
					weld.Part1 = rockClone;
				}
			}

			if (attackmentRock.CurrentLifeTime >= attackmentRock.LifeTime) AttachmentRocks.delete(attachment);
		});
	}

	private static _Crater(
		Center: CFrame,
		NoSpawnRadius = 0,
		Size = 1,
		Radius = 7,
		Rocks = 10,
		SubRocks = 2,
		UpTime = 0.35,
		Irregular = false,
		IrregularSize = 1,
	) {
		const ray = Workspace.Raycast(Center.Position.add(new Vector3(0, 10, 0)), new Vector3(0, -20, 0), RayParams);
		if (!ray) return;
		Rocks = Rocks * ((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1);
		SubRocks = SubRocks * ((SettingsManager.GetSetting(Player, ESettingsVisual.SubDebris) as number) ?? 1);
		const newCframe = new CFrame(ray.Position);
		const upTimeTween = new TweenInfo(UpTime, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		let angle = 0;

		const noSpawnPosition = Center.Position.add(Center.LookVector.mul(NoSpawnRadius));

		if (Rocks === 0) return;
		for (const i of $range(1, Rocks)) {
			let cf = newCframe.mul(CFrame.Angles(0, math.rad(angle), 0)).mul(new CFrame(0, 0, -Radius));

			if (cf.Position.sub(noSpawnPosition).Magnitude < NoSpawnRadius) {
				angle += 360 / Rocks;
				continue;
			}

			let newRay: RaycastResult | undefined;
			if (Irregular)
				newRay = Workspace.Raycast(
					cf.Position.add(ray.Normal.mul(6)).add(
						new Vector3(math.random(-1, 1), 0, math.random(-1, 1)).mul(IrregularSize),
					),
					ray.Normal.mul(-20),
					RayParams,
				);
			else newRay = Workspace.Raycast(cf.Position.add(ray.Normal.mul(6)), ray.Normal.mul(-20), RayParams);
			if (!newRay) {
				angle += 360 / Rocks;
				continue;
			}
			cf = new CFrame(newRay.Position, ray.Position.add(new Vector3(0, 1, 0).mul(Radius / 3)));

			const Rock = new Instance("Part", DebrisFolder);
			Rock.Size = new Vector3(math.random(4, 8), math.random(3, 6), math.random(3, 6)).mul(Size);
			Rock.CFrame = cf.sub(new Vector3(0, 5, 0));

			Rock.Material = newRay.Material;
			Rock.Color = newRay.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(newRay.Material)
				: newRay.Instance.Color;

			Rock.Anchored = true;
			Rock.CanCollide = false;
			Rock.CanQuery = false;
			Rock.CanTouch = false;

			Collector.AddItem(Rock, 10);

			Tools.TweenPlay(Rock, upTimeTween, {
				CFrame: cf.sub(new Vector3(0, 0.3, 0)),
			});

			task.delay(math.random(250, 450) / 100, () => {
				Tools.TweenPlay(Rock, CraterInfo, {
					CFrame: Rock.CFrame.sub(new Vector3(0, 10, 0)),
				});
			});

			angle += 360 / Rocks;

			const randomNumber = math.random(0, SubRocks);
			if (randomNumber === 0) continue;
			for (const j of $range(1, randomNumber)) {
				const rockClone = new Instance("Part", Rock);
				rockClone.CFrame = Rock.CFrame.add(
					new Vector3(math.random(-1, 1) + 0.2, math.random(-1, 1) + 0.2, math.random(-1, 1) + 0.2).mul(Size),
				);
				rockClone.Size = new Vector3(math.random(3, 5), math.random(2, 3), math.random(2, 4)).mul(Size);

				rockClone.Material = Rock.Material;
				rockClone.Color = Rock.Color;

				rockClone.Anchored = false;
				rockClone.CanCollide = false;
				rockClone.CanQuery = false;
				rockClone.CanTouch = false;

				const weld = new Instance("WeldConstraint", Rock);
				weld.Part0 = Rock;
				weld.Part1 = rockClone;
			}
		}
	}

	public static Crater = (
		Center: CFrame,
		NoSpawnRadius = 0,
		Size = 1,
		Radius = 7,
		Rocks = 10,
		SubRocks = 2,
		UpTime = 0.35,
		Irregular = false,
		IrregularSize = 1,
	) =>
		task.spawn(() =>
			this._Crater(Center, NoSpawnRadius, Size, Radius, Rocks, SubRocks, UpTime, Irregular, IrregularSize),
		);

	private static _Explosion(Center: Vector3, Size = 1, Velocity = 1, Radius = 3, TotalRocks = 7) {
		const rayResult = Workspace.Raycast(Center, new Vector3(0, -5, 0), RayParams);
		if (!rayResult) return;
		TotalRocks = TotalRocks * ((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1);
		const rayDirections = [
			new Vector3(Radius, 10, 0),
			new Vector3(-Radius, 10, 0),
			new Vector3(0, 10, Radius),
			new Vector3(0, 10, -Radius),
		];

		const rayMaterials: Array<Enum.Material> = [];
		const rayColors: Color3[] = [];

		for (const direction of rayDirections) {
			const rayResult = Workspace.Raycast(Center.add(direction), new Vector3(0, -20, 0), RayParams);
			if (!rayResult) continue;

			rayMaterials.push(rayResult.Material);
			const color = rayResult.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(rayResult.Material)
				: rayResult.Instance.Color;
			rayColors.push(color);
		}

		let velocity = Vector3.zero;

		if (TotalRocks === 0) return;
		for (const i of $range(0, TotalRocks - 1)) {
			const Rock = new Instance("Part", DebrisFolder);

			const randomSize = math.random(0.5 * 100, 2.5 * 100) / 100;
			Rock.Size =
				math.random(1, 5) === 3
					? new Vector3(randomSize * 2, 0.15, randomSize * 2).mul(Size)
					: new Vector3(randomSize, randomSize, randomSize).mul(Size);

			Rock.CFrame = new CFrame(Center).mul(RandomAngle());

			const randomIndex = math.random(0, rayMaterials.size() - 1);
			Rock.Color = rayColors[randomIndex];
			Rock.Material = rayMaterials[randomIndex];

			Rock.CanQuery = false;
			Rock.CanTouch = false;
			Rock.AddTag("NoCameraCollide");
			Rock.CollisionGroup = "RockDebris";

			Collector.AddItem(Rock, 5);

			const velocitySpread = 28;

			velocity = new Vector3(
				Tools.RandomOutsideRange(-velocitySpread, velocitySpread, -8, 8),
				math.random(15, 30),
				Tools.RandomOutsideRange(-velocitySpread, velocitySpread, -8, 8),
			);

			velocity = i % 2 === 0 ? velocity : velocity.mul(new Vector3(-1, 1, -1));

			Rock.ApplyImpulse(velocity.mul(Rock.AssemblyMass).mul(Velocity));

			task.delay(math.random(250, 450) / 100, () => {
				Tools.TweenPlay(Rock, ExplosionInfo, {
					Size: new Vector3(0, 0, 0),
				});
			});
		}
	}

	public static Explosion = (Center: Vector3, Size = 1, Velocity = 1, Radius = 3, TotalRocks = 7) =>
		task.spawn(() => this._Explosion(Center, Size, Velocity, Radius, TotalRocks));

	private static _Trail(
		origin: CFrame,
		Rocks: number,
		distance: number,
		width: number,
		size: Vector3,
		widthFinal: number,
		sizeFinal: number,
		speedIn: number,
		speedOut: number,
		rounded: boolean,
		segmentSize: number,
		lifeTime: number,
		waitInterval: number,
	) {
		Rocks = Rocks * ((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1);

		const tInfo = new TweenInfo(speedIn, Enum.EasingStyle.Back, Enum.EasingDirection.Out);

		let c1: CFrame = new CFrame();
		let c2: CFrame = new CFrame();

		const spacing = distance / Rocks;
		const widthIncrement = (widthFinal - width) / Rocks;
		const sizeIncrement = (sizeFinal - 1) / Rocks;

		if (Rocks === 0) return;
		for (const i of $range(0, Rocks - 1)) {
			const currentWidth = width + i * widthIncrement;
			const currentSize = size.mul(1 + i * sizeIncrement);

			c1 = origin.mul(new CFrame(currentWidth, 5, -i * spacing));
			let newRay = Workspace.Raycast(c1.Position.add(new Vector3(0, 20, 0)), new Vector3(0, -100, 0), RayParams);
			if (newRay) {
				c1 = new CFrame(newRay.Position).mul(RandomAngle());

				const Rock = new Instance("Part", DebrisFolder);
				Rock.Size = currentSize;
				const c1Pos = c1.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
				Rock.CFrame = c1Pos;

				Rock.Material = newRay.Material;
				Rock.Color = newRay.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(newRay.Material)
					: newRay.Instance.Color;

				Rock.Anchored = true;
				Rock.CanCollide = false;
				Rock.CanQuery = false;
				Rock.CanTouch = false;

				Tools.TweenPlay(Rock, tInfo, {
					CFrame: c1,
				});

				const randomTime = math.random(50, 150) / 100;
				Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
				task.delay(lifeTime + randomTime, () => {
					Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
						CFrame: c1Pos,
					});
				});
			}

			c2 = origin.mul(new CFrame(-currentWidth, 5, -i * spacing));
			newRay = Workspace.Raycast(c2.Position.add(new Vector3(0, 20, 0)), new Vector3(0, -100, 0), RayParams);
			if (newRay) {
				c2 = new CFrame(newRay.Position).mul(RandomAngle());

				const Rock = new Instance("Part", DebrisFolder);
				Rock.Size = currentSize;
				const c2Pos = c2.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
				Rock.CFrame = c2Pos;

				Rock.Material = newRay.Material;
				Rock.Color = newRay.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(newRay.Material)
					: newRay.Instance.Color;

				Rock.Anchored = true;
				Rock.CanCollide = false;
				Rock.CanQuery = false;
				Rock.CanTouch = false;

				Tools.TweenPlay(Rock, tInfo, {
					CFrame: c2,
				});

				const randomTime = math.random(50, 150) / 100;
				Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
				task.delay(lifeTime + randomTime, () => {
					Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
						CFrame: c2Pos,
					});
				});
			}

			if (i % segmentSize === 0) task.wait(waitInterval);
		}

		if (!rounded) return;

		const dist = c1.Position.sub(c2.Position).Magnitude;
		const segments = math.min(Rocks / 2, math.ceil(dist));

		const center = new CFrame(
			c1.Position.add(c2.Position).div(2),
			c1.Position.add(c2.Position).div(2).add(origin.LookVector),
		).mul(CFrame.Angles(0, math.rad(-90), 0));
		const angle = 180 / segments;

		for (const i of $range(0, segments - 1)) {
			let r1 = center.mul(CFrame.Angles(0, math.rad((i - 1) * angle), 0)).mul(new CFrame(0, 0, -dist / 2));
			const newRay = Workspace.Raycast(
				r1.Position.add(new Vector3(0, 20, 0)),
				new Vector3(0, -100, 0),
				RayParams,
			);
			if (!newRay) continue;
			r1 = new CFrame(newRay.Position).mul(RandomAngle());

			const Rock = new Instance("Part", DebrisFolder);
			Rock.Size = size.mul(1 + sizeFinal);
			const r1Pos = r1.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
			Rock.CFrame = r1Pos;

			Rock.Material = newRay.Material;
			Rock.Color = newRay.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(newRay.Material)
				: newRay.Instance.Color;

			Rock.Anchored = true;
			Rock.CanCollide = false;
			Rock.CanQuery = false;
			Rock.CanTouch = false;

			Tools.TweenPlay(Rock, tInfo, {
				CFrame: r1,
			});

			const randomTime = math.random(50, 150) / 100;
			Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
			task.delay(lifeTime + randomTime, () => {
				Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
					CFrame: r1Pos,
				});
			});
		}
	}

	public static Trail = (
		origin: CFrame,
		rocks: number,
		distance: number,
		width: number,
		size: Vector3,
		widthM: number,
		sizeM: number,
		speedIn: number,
		speedOut: number,
		rounded: boolean,
		segmentSize: number,
		lifeTime: number,
		waitInterval: number,
	) =>
		task.spawn(() =>
			this._Trail(
				origin,
				rocks,
				distance,
				width,
				size,
				widthM,
				sizeM,
				speedIn,
				speedOut,
				rounded,
				segmentSize,
				lifeTime,
				waitInterval,
			),
		);

	private static _RandomTrail(
		origin: CFrame,
		randomMultiplier: number,
		Rocks: number,
		distance: number,
		width: number,
		size: Vector3,
		widthFinal: number,
		sizeFinal: number,
		speedIn: number,
		speedOut: number,
		rounded: boolean,
		segmentSize: number,
		lifeTime: number,
		waitInterval: number,
	) {
		Rocks = Rocks * ((SettingsManager.GetSetting(Player, ESettingsVisual.Debris) as number) ?? 1);
		const tInfo = new TweenInfo(speedIn, Enum.EasingStyle.Back, Enum.EasingDirection.Out);

		let c1: CFrame = new CFrame();
		let c2: CFrame = new CFrame();

		const spacing = distance / Rocks;
		const widthIncrement = (widthFinal - width) / Rocks;
		const sizeIncrement = (sizeFinal - 1) / Rocks;
		let Origin = origin;

		if (Rocks === 0) return;
		for (const i of $range(0, Rocks - 1)) {
			const currentWidth = width + i * widthIncrement;
			const currentSize = size.mul(1 + i * sizeIncrement);

			c1 = Origin.mul(new CFrame(currentWidth, 5, -i * spacing));
			let newRay = Workspace.Raycast(c1.Position.add(new Vector3(0, 20, 0)), new Vector3(0, -100, 0), RayParams);
			if (newRay) {
				c1 = new CFrame(newRay.Position).mul(RandomAngle());

				const Rock = new Instance("Part", DebrisFolder);
				Rock.Size = currentSize;
				const c1Pos = c1.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
				Rock.CFrame = c1Pos;

				Rock.Material = newRay.Material;
				Rock.Color = newRay.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(newRay.Material)
					: newRay.Instance.Color;

				Rock.Anchored = true;
				Rock.CanCollide = false;
				Rock.CanQuery = false;
				Rock.CanTouch = false;

				Tools.TweenPlay(Rock, tInfo, {
					CFrame: c1,
				});

				const randomTime = math.random(50, 150) / 100;
				Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
				task.delay(lifeTime + randomTime, () => {
					Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
						CFrame: c1Pos,
					});
				});
			}

			c2 = Origin.mul(new CFrame(-currentWidth, 5, -i * spacing));
			newRay = Workspace.Raycast(c2.Position.add(new Vector3(0, 20, 0)), new Vector3(0, -100, 0), RayParams);
			if (newRay) {
				c2 = new CFrame(newRay.Position).mul(RandomAngle());

				const Rock = new Instance("Part", DebrisFolder);
				Rock.Size = currentSize;
				const c2Pos = c2.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
				Rock.CFrame = c2Pos;

				Rock.Material = newRay.Material;
				Rock.Color = newRay.Instance.IsA("Terrain")
					? Workspace.Terrain.GetMaterialColor(newRay.Material)
					: newRay.Instance.Color;

				Rock.Anchored = true;
				Rock.CanCollide = false;
				Rock.CanQuery = false;
				Rock.CanTouch = false;

				Tools.TweenPlay(Rock, tInfo, {
					CFrame: c2,
				});

				const randomTime = math.random(50, 150) / 100;
				Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
				task.delay(lifeTime + randomTime, () => {
					Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
						CFrame: c2Pos,
					});
				});
			}

			Origin = Origin.mul(new CFrame(math.random(-randomMultiplier, randomMultiplier), 0, 0));
			if (i % segmentSize === 0) task.wait(waitInterval);
		}

		if (!rounded) return;

		const dist = c1.Position.sub(c2.Position).Magnitude;
		const segments = math.min(Rocks / 2, math.ceil(dist));

		const center = new CFrame(
			c1.Position.add(c2.Position).div(2),
			c1.Position.add(c2.Position).div(2).add(Origin.LookVector),
		).mul(CFrame.Angles(0, math.rad(-90), 0));
		const angle = 180 / segments;

		for (const i of $range(0, segments - 1)) {
			let r1 = center.mul(CFrame.Angles(0, math.rad((i - 1) * angle), 0)).mul(new CFrame(0, 0, -dist / 2));
			const newRay = Workspace.Raycast(
				r1.Position.add(new Vector3(0, 20, 0)),
				new Vector3(0, -100, 0),
				RayParams,
			);
			if (!newRay) continue;
			r1 = new CFrame(newRay.Position).mul(RandomAngle());

			const Rock = new Instance("Part", DebrisFolder);
			Rock.Size = size.mul(1 + sizeFinal);
			const r1Pos = r1.sub(new Vector3(0, 1 * Rock.Size.Y, 0));
			Rock.CFrame = r1Pos;

			Rock.Material = newRay.Material;
			Rock.Color = newRay.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(newRay.Material)
				: newRay.Instance.Color;

			Rock.Anchored = true;
			Rock.CanCollide = false;
			Rock.CanQuery = false;
			Rock.CanTouch = false;

			Tools.TweenPlay(Rock, tInfo, {
				CFrame: r1,
			});

			const randomTime = math.random(50, 150) / 100;
			Collector.AddItem(Rock, lifeTime + speedOut + randomTime);
			task.delay(lifeTime + randomTime, () => {
				Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
					CFrame: r1Pos,
				});
			});
		}
	}

	public static RandomTrail = (
		origin: CFrame,
		randomMultiplier: number,
		rocks: number,
		distance: number,
		width: number,
		size: Vector3,
		widthFinal: number,
		sizeFinal: number,
		speedIn: number,
		speedOut: number,
		rounded: boolean,
		segmentSize: number,
		lifeTime: number,
		waitInterval: number,
	) =>
		task.spawn(() =>
			this._RandomTrail(
				origin,
				randomMultiplier,
				rocks,
				distance,
				width,
				size,
				widthFinal,
				sizeFinal,
				speedIn,
				speedOut,
				rounded,
				segmentSize,
				lifeTime,
				waitInterval,
			),
		);
}
