// Imports
import { Workspace } from "@rbxts/services";

// Variables
const HitboxFolder = Workspace.WaitForChild("Hitbox");

export class HitboxManager {
	public static Create(
		shape: Enum.PartType,
		size: Vector3,
		cframe: CFrame,
		lifeTime: number,
		destroy: boolean,
		params: OverlapParams,
		funct: Callback,
	) {
		const HitBox = new Instance("Part", HitboxFolder);
		HitBox.Shape = shape;
		HitBox.Size = size;
		HitBox.Anchored = true;
		HitBox.CanCollide = false;
		HitBox.Transparency = 0.7;
		HitBox.Color = Color3.fromRGB(255, 0, 0);
		HitBox.CFrame = cframe;
		if (shape === Enum.PartType.Cylinder) HitBox.Orientation = new Vector3(0, 0, -90);

		/*if (destroy) {
			const partCFrame = HitBox.CFrame;
			const partSize = HitBox.Size;

			// Calcula el tamaño de cada "voxel" a llenar (usualmente 4 es un tamaño común)
			const voxelSize = 4;

			// Calcula los límites de la región
			const minX = partCFrame.Position.X - partSize.X / 2;
			const maxX = partCFrame.Position.X + partSize.X / 2;
			const minY = partCFrame.Position.Y - partSize.Y / 2;
			const maxY = partCFrame.Position.Y + partSize.Y / 2;
			const minZ = partCFrame.Position.Z - partSize.Z / 2;
			const maxZ = partCFrame.Position.Z + partSize.Z / 2;

			// Rellena el terrain en secciones pequeñas dentro de la región de la part
			for (let x = minX; x < maxX; x += voxelSize) {
				for (let y = minY; y < maxY; y += voxelSize) {
					for (let z = minZ; z < maxZ; z += voxelSize) {
						const regionStart = new Vector3(x, y, z);
						const regionEnd = regionStart.add(new Vector3(voxelSize, voxelSize, voxelSize));
						const region = new Region3(regionStart, regionEnd);

						// Llena la región con aire para vaciar el terrain
						Workspace.Terrain.FillRegion(region, voxelSize, Enum.Material.Air);
					}
				}
			}
		}*/

		const partsOnHitBox = Workspace.GetPartsInPart(HitBox, params);

		for (const part of partsOnHitBox) funct(part);

		const HitBoxConnection = HitBox.Touched.Connect((part: BasePart) => {
			const isDescendant = params.FilterDescendantsInstances.some((instance) => part.IsDescendantOf(instance));
			if (isDescendant) return;
			funct(part);
		});

		delay(lifeTime, () => {
			if (HitBox) HitBox.Destroy();
			if (HitBoxConnection) HitBoxConnection.Disconnect();
		});
		return HitBox;
	}

	public static CreateMultiple(
		size: Vector3,
		sizeFinal: Vector3,
		cframe: CFrame,
		quantity: number,
		waitTime: number,
		lifeTime: number,
		destroy: boolean,
		params: OverlapParams,
		funct: Callback,
	) {
		let accumulatedOffsetZ = 0;

		for (let i = 0; i < quantity; i++) {
			const t = i / (quantity - 1);
			const currentSize = new Vector3(
				size.X + (sizeFinal.X - size.X) * t,
				size.Y + (sizeFinal.Y - size.Y) * t,
				size.Z + (sizeFinal.Z - size.Z) * t,
			);

			const boxCFrame = cframe.mul(new CFrame(0, 0, -accumulatedOffsetZ - currentSize.Z / 2));
			this.Create(Enum.PartType.Block, currentSize, boxCFrame, lifeTime, destroy, params, (part) =>
				funct(part, i),
			);
			accumulatedOffsetZ += currentSize.Z;
			task.wait(waitTime);
		}
	}
}
