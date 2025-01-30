// Imports
import { Workspace } from "@rbxts/services";

// Variables
const Visualize = false;
const HitboxFolder = Workspace.WaitForChild("Hitbox");
const DebrisFolder = Workspace.WaitForChild("Debris");

export class HitboxManager {
	public static Create(
		shape: Enum.PartType,
		size: Vector3, // (Anch, Height, Large)
		cframe: CFrame,
		lifeTime: number,
		destroy: boolean,
		weldTo: BasePart | undefined = undefined,
		params: OverlapParams,
		funct: Callback,
	) {
		const HitBox = new Instance("Part", HitboxFolder);

		if (Visualize) {
			HitBox.Material = Enum.Material.Glass;
			HitBox.Color = Color3.fromRGB(255, 0, 0);
			HitBox.Transparency = 0.75;
		} else HitBox.Transparency = 1;

		HitBox.Shape = shape;
		HitBox.Size = size;
		HitBox.CanCollide = false;
		HitBox.CFrame = cframe;
		if (shape === Enum.PartType.Cylinder) HitBox.Orientation = new Vector3(0, 0, -90);
		if (weldTo) {
			HitBox.Massless = true;
			const Weld = new Instance("WeldConstraint", HitBox);
			Weld.Part0 = HitBox;
			Weld.Part1 = weldTo;
		} else HitBox.Anchored = true;

		params.FilterDescendantsInstances = [...params.FilterDescendantsInstances, DebrisFolder, HitboxFolder];
		const partsOnHitBox = Workspace.GetPartsInPart(HitBox, params);

		if (destroy) {
			/*
				// Destroy
				task.spawn(() => {
					for (const part of partsOnHitBox) VoxBreaker.VoxelizePart(part, 1, 10);
				});
			*/
		}

		for (const part of partsOnHitBox) funct(part);

		const HitBoxConnection = HitBox.Touched.Connect((part: BasePart) => {
			const isDescendant = params.FilterDescendantsInstances.some((instance) => part.IsDescendantOf(instance));
			if (isDescendant) return;

			funct(part);
		});

		task.delay(lifeTime, () => {
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

		for (const i of $range(0, quantity - 1)) {
			const t = i / (quantity - 1);
			const currentSize = new Vector3(
				size.X + (sizeFinal.X - size.X) * t,
				size.Y + (sizeFinal.Y - size.Y) * t,
				size.Z + (sizeFinal.Z - size.Z) * t,
			);

			const boxCFrame = cframe.mul(new CFrame(0, 0, -accumulatedOffsetZ - currentSize.Z / 2));
			this.Create(Enum.PartType.Block, currentSize, boxCFrame, lifeTime, destroy, undefined, params, (part) =>
				funct(part, i),
			);
			accumulatedOffsetZ += currentSize.Z;
			task.wait(waitTime);
		}
	}
}
