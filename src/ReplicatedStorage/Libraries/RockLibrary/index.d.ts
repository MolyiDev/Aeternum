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
		SubRocksCount: number,
		LifeTime: number,
		TimeIn: number,
		TimeOut: number,
		WaitInterval: number,
	): void;

	/**
	 * Rock Explosion
	 */
	Explosion(this: void, Origin: Vector3, Size: number, Velocity: number, TotalRocks: number, LifeTime: number): void;
}

declare const RockLibrary: RockLibrary;

export = RockLibrary;
