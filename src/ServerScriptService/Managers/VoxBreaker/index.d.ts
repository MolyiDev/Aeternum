interface VoxBreaker {
	VoxelizePart(Part: BasePart, MinimumVoxelSize: number, TimeToReset: number): void;
}

declare const VoxBreaker: VoxBreaker;

export = VoxBreaker;
