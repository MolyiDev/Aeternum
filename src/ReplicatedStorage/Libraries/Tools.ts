// Imports
import { Players, ReplicatedStorage, RunService, TweenService } from "@rbxts/services";
import { ESettingsVisual } from "ReplicatedStorage/Enums/Settings/ESettingsVisual";
import { SettingsManager } from "ReplicatedStorage/Managers/SettingsManager";

// Variables
const SoundsFolder = ReplicatedStorage.WaitForChild("Sounds");
const AnimsFolder = ReplicatedStorage.WaitForChild("Animations");

const GradientChanging = new Map<UIGradient, RBXScriptConnection>();
const TransparencyChanging = new Map<Beam | Trail | UIGradient, RBXScriptConnection>();

const SoundNameToSound = new Map<string, Sound>();
const AnimIdToName = new Map<string, string>();

for (const sound of SoundsFolder.GetDescendants()) {
	if (!sound.IsA("Sound")) continue;
	SoundNameToSound.set(sound.Name, sound);
}

for (const anim of AnimsFolder.GetDescendants()) {
	if (!anim.IsA("Animation")) continue;
	AnimIdToName.set(anim.AnimationId, anim.Name);
}

// Tools class
export class Tools {
	private static LerpColor(c1: Color3, c2: Color3, alpha: number): Color3 {
		return new Color3(c1.R + (c2.R - c1.R) * alpha, c1.G + (c2.G - c1.G) * alpha, c1.B + (c2.B - c1.B) * alpha);
	}

	public static LerpNumber(start: number, final: number, alpha: number): number {
		return start + (final - start) * alpha;
	}

	public static IdToName = (name: string) => AnimIdToName.get(name) as string;

	public static SoundNameToSound = (name: string) => SoundNameToSound.get(name) as Sound;

	public static ProjectOnPlane(vector: Vector3, planeNormal: Vector3) {
		const sqrMag = planeNormal.Dot(planeNormal);

		if (sqrMag < 1e-5) return vector;
		return vector.sub(planeNormal.mul(vector.Dot(planeNormal) / sqrMag));
	}

	private static _TweenGradient(gradient: UIGradient, tweenInfo: TweenInfo, finalGradient: ColorSequence) {
		let Connection = GradientChanging.get(gradient);
		Connection?.Disconnect();
		const time = tweenInfo.Time;
		const easingStyle = tweenInfo.EasingStyle;
		const easingDirection = tweenInfo.EasingDirection;

		const startGradient = gradient.Color.Keypoints;

		if (startGradient.size() !== finalGradient.Keypoints.size()) {
			gradient.Color = finalGradient;
			return;
		}

		let timeElapsed = 0;

		Connection = RunService.RenderStepped.Connect((dt) => {
			timeElapsed += dt;
			let alpha = timeElapsed / time;

			alpha = TweenService.GetValue(alpha, easingStyle, easingDirection);

			const newKeypoints = [];

			for (const i of $range(0, startGradient.size() - 1)) {
				const startPoint = startGradient[i];
				const endPoint = finalGradient.Keypoints[i];

				const newColor = Tools.LerpColor(startPoint.Value, endPoint.Value, alpha);
				const newTime = startPoint.Time + (endPoint.Time - startPoint.Time) * alpha;

				newKeypoints.push(new ColorSequenceKeypoint(newTime, newColor));
			}

			gradient.Color = new ColorSequence(newKeypoints);

			if (timeElapsed >= time) {
				gradient.Color = finalGradient;
				Connection!.Disconnect();

				GradientChanging.delete(gradient);
			}
		});

		GradientChanging.set(gradient, Connection);
	}

	private static _TweenTransparency(
		instance: Beam | Trail | UIGradient,
		tweenInfo: TweenInfo,
		finalSequence: NumberSequence,
	) {
		let Connection = TransparencyChanging.get(instance);
		Connection?.Disconnect();
		const time = tweenInfo.Time;
		const easingStyle = tweenInfo.EasingStyle;
		const easingDirection = tweenInfo.EasingDirection;

		const startSequence = instance.Transparency.Keypoints;

		if (startSequence.size() !== finalSequence.Keypoints.size()) {
			instance.Transparency = finalSequence;
			return;
		}

		let timeElapsed = 0;

		Connection = RunService.RenderStepped.Connect((dt) => {
			timeElapsed += dt;
			let alpha = timeElapsed / time;

			alpha = TweenService.GetValue(alpha, easingStyle, easingDirection);

			const newKeypoints = [];

			for (const i of $range(0, startSequence.size() - 1)) {
				const startPoint = startSequence[i];
				const endPoint = finalSequence.Keypoints[i];

				const newColor = Tools.LerpNumber(startPoint.Value, endPoint.Value, alpha);
				const newTime = startPoint.Time + (endPoint.Time - startPoint.Time) * alpha;

				newKeypoints.push(new NumberSequenceKeypoint(newTime, newColor));
			}

			instance.Transparency = new NumberSequence(newKeypoints);

			if (timeElapsed >= time) {
				Connection!.Disconnect();
				TransparencyChanging.delete(instance);
				instance.Transparency = finalSequence;
			}
		});

		TransparencyChanging.set(instance, Connection);
	}

	private static _EmitParticles(particles: Array<Instance>) {
		const Multiplier = SettingsManager.GetSetting(Players.LocalPlayer, ESettingsVisual.Particles) as number;

		for (const ParticleEmitter of particles) {
			if (!ParticleEmitter.IsA("ParticleEmitter")) continue;
			const EmitDelay = ParticleEmitter.GetAttribute("EmitDelay") as number;

			if (ParticleEmitter.GetAttribute("EmitDelay"))
				task.delay(EmitDelay, () =>
					ParticleEmitter.Emit((ParticleEmitter.GetAttribute("EmitCount") as number) * Multiplier),
				);
			else ParticleEmitter.Emit((ParticleEmitter.GetAttribute("EmitCount") as number) * Multiplier);
		}
	}

	public static EmitParticles = (particles: Array<Instance>) => task.spawn(() => this._EmitParticles(particles));

	public static VectorDistance(pointA: Vector3, pointB: Vector3): number {
		return pointB.sub(pointA).Magnitude;
	}

	public static TweenPlay(instance: Instance, tweenInfo: TweenInfo, propertyTable: { [key: string]: unknown }) {
		const tween = TweenService.Create(instance, tweenInfo, propertyTable);
		tween.Play();
		return tween;
	}

	public static TweensPlay(instances: Instance[], tweenInfo: TweenInfo, propertyTable: { [key: string]: unknown }) {
		instances.forEach((instance) => {
			TweenService.Create(instance, tweenInfo, propertyTable).Play();
		});
	}

	public static TweenGradient(gradient: UIGradient, tweenInfo: TweenInfo, finalGradient: ColorSequence) {
		task.spawn(() => Tools._TweenGradient(gradient, tweenInfo, finalGradient));
	}

	public static TweenTransparency(
		instance: Beam | Trail | UIGradient,
		tweenInfo: TweenInfo,
		finalSequence: NumberSequence,
	) {
		task.spawn(() => Tools._TweenTransparency(instance, tweenInfo, finalSequence));
	}

	public static DarkenColor(color: Color3, factor: number): Color3 {
		return color.Lerp(new Color3(0, 0, 0), factor);
	}

	public static LightenColor(color: Color3, factor: number): Color3 {
		return color.Lerp(new Color3(1, 1, 1), factor);
	}

	public static OffsetToScale(parentSize: Vector2, size: UDim2): UDim2 {
		if (parentSize.X === 0 || parentSize.Y === 0) return size;

		const scaleXSize = size.X.Scale + size.X.Offset / parentSize.X;
		const scaleYSize = size.Y.Scale + size.Y.Offset / parentSize.Y;

		return new UDim2(scaleXSize, 0, scaleYSize, 0);
	}

	public static RandomOutsideRange(min: number, max: number, excludeRangeMin: number, excludeRangeMax: number) {
		const range1 = math.random(min, excludeRangeMin);
		const range2 = math.random(excludeRangeMax, max);

		return math.random() < 0.5 ? range1 : range2;
	}

	public static WorldMovingDirection(dir: Vector3): Vector3 {
		let angle = math.atan2(dir.X, -dir.Z);
		const quarterTurn = math.pi / 4;

		if (dir === Vector3.zero) return dir;

		angle = -math.round(angle / quarterTurn) * quarterTurn;

		let newX = math.round(-math.sin(angle));
		let newZ = math.round(-math.cos(angle));

		if (math.abs(newX) <= 1e-10) newX = 0;
		if (math.abs(newZ) <= 1e-10) newZ = 0;

		return new Vector3(newX, 0, newZ);
	}
}
