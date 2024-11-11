interface WindLinesSettings {
	Direction?: Vector3;
	Speed?: number;
	Lifetime?: number;
	SpawnRate?: number;
}

interface WindLines {
	/**
	 * Initializes the wind shake logic and adds shake to all tagged objects
	 *  * @param settings The settings to be used
	 */
	Init(settings: WindLinesSettings): void;

	/**
	 * Halts and clears the wind shake logic and all object shakes
	 */
	Cleanup(): void;
}

declare const WindLines: WindLines;

export = WindLines;
