// Imports
import { TweenService, Debris, Workspace } from "@rbxts/services";
import { Tools } from "shared/Libraries/Tools";

// Variables
const CharactersFolder = Workspace.WaitForChild("Characters");
const DebrisFolder = Workspace.WaitForChild("Debris");
const HitboxFolder = Workspace.WaitForChild("Hitbox");

const CraterInfo = new TweenInfo(5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
const ExplosionInfo = new TweenInfo(0.75, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);

const RayParams = new RaycastParams();
RayParams.FilterDescendantsInstances = [CharactersFolder, DebrisFolder, HitboxFolder];
RayParams.FilterType = Enum.RaycastFilterType.Exclude;
RayParams.IgnoreWater = true;

function SpawnPart(
	initialCF: CFrame,
	finalCF: CFrame,
	size: Vector3,
	material: Enum.Material,
	trasparency: number,
	color: Color3,
	anchored: boolean,
	collide: boolean,
	tInfo: TweenInfo,
) {
	const part = new Instance("Part", DebrisFolder);
	part.CFrame = initialCF;
	part.Size = new Vector3(0, 0, 0);
	part.Material = material;
	part.Transparency = trasparency;
	part.Anchored = anchored;
	part.CanCollide = collide;
	part.Color = color;
	Tools.TweenPlay(part, tInfo, { Size: size, CFrame: finalCF });
	return part;
}

function RandomAngle() {
	return CFrame.Angles(math.rad(math.random(0, 360)), math.rad(math.random(0, 360)), math.rad(math.random(0, 360)));
}

export class RockManager {
	private static _Crater(
		Center: CFrame,
		NoSpawnRadius = 0,
		Size = 1,
		Radius = 7,
		Rocks = 10,
		DoubleMax = 2,
		UpTime = 0.35,
	) {
		const ray = Workspace.Raycast(Center.Position.add(new Vector3(0, 10, 0)), new Vector3(0, -20, 0), RayParams);
		if (!ray) return;
		const newCframe = new CFrame(ray.Position);
		let angle = 0;

		const noSpawnPosition = Center.Position.add(Center.LookVector.mul(NoSpawnRadius));

		for (let i = 0; i < Rocks; i++) {
			let cf = newCframe.mul(CFrame.Angles(0, math.rad(angle), 0)).mul(new CFrame(0, 0, -Radius));

			// Verificar la distancia del punto cf.Position al noSpawnPosition
			if (cf.Position.sub(noSpawnPosition).Magnitude < NoSpawnRadius) {
				angle += 360 / Rocks;
				continue; // Saltar esta iteración si está dentro del NoSpawnRadius
			}

			const newRay = Workspace.Raycast(cf.Position.add(ray.Normal.mul(6)), ray.Normal.mul(-20), RayParams);
			if (!newRay) continue;
			cf = new CFrame(newRay.Position, ray.Position.add(new Vector3(0, 2, 0).mul(Size)));

			const Rock = new Instance("Part", DebrisFolder);
			Rock.Size = new Vector3(math.random(3, 5), math.random(2, 3), math.random(2, 4)).mul(Size);
			Rock.CFrame = cf.sub(new Vector3(0, 5, 0));

			Rock.Material = newRay.Material;
			Rock.Color = newRay.Instance.IsA("Terrain")
				? Workspace.Terrain.GetMaterialColor(newRay.Material)
				: newRay.Instance.Color;

			Rock.Anchored = true;
			Rock.CanCollide = false;
			Rock.CanQuery = false;
			Rock.CanTouch = false;

			const randomNumber = math.random(0, DoubleMax);
			for (let j = 0; j < randomNumber; j++) {
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

			Debris.AddItem(Rock, 10);

			Tools.TweenPlay(Rock, new TweenInfo(UpTime, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
				CFrame: cf,
			});

			task.delay(math.random(250, 450) / 100, () => {
				Tools.TweenPlay(Rock, CraterInfo, {
					CFrame: Rock.CFrame.sub(new Vector3(0, 10, 0)),
				});
			});

			angle += 360 / Rocks;
		}
	}

	public static Crater = (
		Center: CFrame,
		NoSpawnRadius = 0,
		Size = 1,
		Radius = 7,
		Rocks = 10,
		DoubleMax = 2,
		UpTime = 0.35,
	) => task.spawn(() => this._Crater(Center, NoSpawnRadius, Size, Radius, Rocks, DoubleMax, UpTime));

	private static _Explosion(Center: Vector3, Size = 1, Velocity = 1, Radius = 3, TotalRocks = 7) {
		const rayResult = Workspace.Raycast(Center, new Vector3(0, -5, 0), RayParams);
		if (!rayResult) return;
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

		for (let i = 0; i < TotalRocks; i++) {
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

			Debris.AddItem(Rock, 5);

			const velocitySpread = 32;
			const upwardForce = 22;
			const velocity = new Vector3(
				math.random(-velocitySpread, velocitySpread),
				upwardForce,
				math.random(-velocitySpread, velocitySpread),
			);
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
	) {
		const tInfo = new TweenInfo(speedIn, Enum.EasingStyle.Back, Enum.EasingDirection.Out);

		let c1: CFrame = new CFrame();
		let c2: CFrame = new CFrame();

		const spacing = distance / rocks;
		const widthIncrement = (widthFinal - width) / rocks;
		const sizeIncrement = (sizeFinal - 1) / rocks;

		for (let i = 0; i < rocks; i++) {
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
				Debris.AddItem(Rock, lifeTime + speedOut + randomTime);
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
				Debris.AddItem(Rock, lifeTime + speedOut + randomTime);
				task.delay(lifeTime + randomTime, () => {
					Tools.TweenPlay(Rock, new TweenInfo(speedOut, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
						CFrame: c2Pos,
					});
				});
			}

			if (i % segmentSize === 0) task.wait();
		}

		if (!rounded) return;

		const dist = c1.Position.sub(c2.Position).Magnitude;
		const segments = math.min(rocks / 2, math.ceil(dist));

		const center = new CFrame(
			c1.Position.add(c2.Position).div(2),
			c1.Position.add(c2.Position).div(2).add(origin.LookVector),
		).mul(CFrame.Angles(0, math.rad(-90), 0));
		const angle = 180 / segments;

		for (let i = 0; i < segments; i++) {
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
			Debris.AddItem(Rock, lifeTime + speedOut + randomTime);
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
			),
		);

	public static ClearDebris() {
		DebrisFolder.GetChildren().forEach((v) => {
			if (v.IsA("BasePart")) {
				TweenService.Create(v, new TweenInfo(0.75, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), {
					Size: new Vector3(0.1, 0.1, 0.1),
					Transparency: 1,
				}).Play();
				Debris.AddItem(v, 1);
			}
		});
	}
}
