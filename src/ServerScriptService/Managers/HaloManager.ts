const DEFAULT_COLOR_PRINCIPAL = Color3.fromRGB(255, 255, 255);
const DEFAULT_COLOR_CENTER = Color3.fromRGB(6, 255, 255);
const DEFAULT_COLOR_SIDES = Color3.fromRGB(255, 255, 255);

interface Halo extends Model {
	HaloPrincipal: MeshPart;
	HaloCenter: MeshPart;
	HaloSides: MeshPart;
}

interface HumanoidModel extends Humanoid {
	Halo: Halo;
}

export class HaloManager {
	public static ChangeColor(humanoid: Humanoid, color: Color3) {
		const Humanoid = humanoid as HumanoidModel;
		Humanoid.Halo.HaloPrincipal.Color = color;
		Humanoid.Halo.HaloSides.Color = color;
	}

	public static DefaultColor(humanoid: Humanoid) {
		const Humanoid = humanoid as HumanoidModel;
		Humanoid.Halo.HaloPrincipal.Color = DEFAULT_COLOR_PRINCIPAL;
		Humanoid.Halo.HaloCenter.Color = DEFAULT_COLOR_CENTER;
		Humanoid.Halo.HaloSides.Color = DEFAULT_COLOR_SIDES;
	}
}
