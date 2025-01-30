import WindLines from "./WindLines";
import WindShake from "./WindShake";

const WIND_DIRECTION = new Vector3(1, 0, 0.3);
const WIND_SPEED = 20;
const WIND_POWER = 0.5;

export class WindManager {
	public static Init() {
		WindLines.Init({
			Direction: WIND_DIRECTION,
			Speed: WIND_SPEED,
			Lifetime: 1.75,
			SpawnRate: 45,
		});

		WindShake.SetDefaultSettings({
			WindSpeed: WIND_SPEED,
			WindDirection: WIND_DIRECTION,
			WindPower: WIND_POWER,
		});

		WindShake.Init();
	}

	public static CleanUp() {
		WindLines.Cleanup();
		WindShake.Cleanup();
	}
}
