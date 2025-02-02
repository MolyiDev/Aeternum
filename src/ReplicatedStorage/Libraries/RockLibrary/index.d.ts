interface RockLibrary {
	/**
	 * Rock Line
	 */
	Line(
		this: void,
		Origin: CFrame,
		Angle: number,
		Separation: number,
		LineCount: number,
		Distance: number,
		StartSize: number,
		EndSize: number,
		RocksCount: number,
		LifeTime: number,
		TimeIn: number,
		TimeOut: number,
		WaitInterval: number,
	): void;

	/*
	 * Rock Random Line
	 */

	RandomLine(
		this: void,
		Origin: CFrame,
		Angle: number,
		RandomRange: number,
		LineCount: number,
		Distance: number,
		StartSize: number,
		EndSize: number,
		RocksCount: number,
		LifeTime: number,
		TimeIn: number,
		TimeOut: number,
		WaitInterval: number,
	): void;

	/**
	 * Rock Explosion
	 */
	Explosion(this: void, Origin: Vector3, Size: number, Velocity: number, TotalRocks: number, LifeTime: number): void;

	/**
	 * Rock Crater
	 */
	Crater(
		this: void,
		Origin: CFrame,
		Radius: number,
		Size: number,
		RocksCount: number,
		SubRocksCount: number,
		LifeTime: number,
		NoSpawnRadius: number,
		TimeIn: number,
		TimeOut: number,
		Irregular: boolean,
		IrregularSize?: number,
	): void;
}

declare const RockLibrary: RockLibrary;

export = RockLibrary;
