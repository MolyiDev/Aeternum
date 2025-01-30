// Imports
import { StyleInfo } from "ReplicatedStorage/Attributes/StyleInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMovementState } from "ReplicatedStorage/Enums/Movement/EMovementState";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { CStyle } from "ReplicatedStorage/Classes/Abstracts/CStyle";
import { ReplicatedStorage, RunService } from "@rbxts/services";

const Style = `${EStyle.Default}_${EWeapon.Hands}_${EStyleType.Idle}`;

const VariantsQuantity = ReplicatedStorage.WaitForChild("Animations")
	.WaitForChild("Styles")
	.WaitForChild("Default")
	.WaitForChild("Hands")
	.WaitForChild("Idle")
	.WaitForChild("Variants")
	.GetDescendants()
	.size();

const VARIANT_COOLDOWN = 25;

const Default_Hands_IdleInfo = {
	[EAnimations.Default_Hands_Idle]: {
		CanOverride: true,
		ReplicateStunned: true,
		StyleClass: Style,
	},
	[EAnimations.Default_Hands_IdleVariant1]: {
		CanOverride: false,
		ReplicateStunned: true,
		StyleClass: Style,
	},
};

@StyleInfo(Style, {})
class Default_Hands_Idle extends CStyle {
	private IsActive: boolean = false;
	private IsLoopActive: boolean = false;
	private LoopCooldown: number = 0;
	private AnimationVariants: AnimationTrack[] = [];
	private Animation: AnimationTrack;

	constructor(character: Character) {
		super(character);
		this.Animation = character.Animations.GetAnimation(EAnimations.Default_Hands_Idle);
		this.AnimationVariants.push(character.Animations.GetAnimation(EAnimations.Default_Hands_IdleVariant1));
		for (const i of $range(1, VariantsQuantity)) {
			const AnimVariant = character.Animations.GetAnimation(`Default_Hands_IdleVariant${i}`);
			this.AnimationVariants.push(AnimVariant);
			this.Butler.Connect(AnimVariant.Stopped, () => this.Animation.Play(0.3, 1, 0.65));
		}
	}

	public Destroy() {
		this.Stop();
		this.AnimationVariants.clear();

		this.IsActive = undefined!;
		this.IsLoopActive = undefined!;
		this.LoopCooldown = undefined!;
		this.AnimationVariants = undefined!;
		this.Animation = undefined!;

		super.Destroy();
	}

	public Start() {
		if (this.IsActive) return;
		this.IsActive = true;
		this.Animation.Play(0.3, 1, 0.65);
		if (!this.IsLoopActive)
			task.spawn(() => {
				this.IsLoopActive = true;

				while (this.IsActive) {
					const dt = RunService.Heartbeat.Wait()[0];
					this.LoopCooldown += dt;
					if (!this.IsActive) break;
					if (this.LoopCooldown < VARIANT_COOLDOWN) continue;

					if (
						this.States.State !== EMovementState.Idle ||
						(this.Attributes.UsingStyle() && this.Attributes.UsingStyle() !== this.Style)
					) {
						this.LoopCooldown = 0;
						continue;
					}

					const randomIndex = math.random(0, this.AnimationVariants.size() - 1);
					const randomAnimation = this.AnimationVariants[randomIndex];

					randomAnimation.Play(0.35, 10, 0.85);
					this.LoopCooldown = 0;
				}

				this.LoopCooldown = 0;
				this.IsLoopActive = false;
			});
	}

	public Stop() {
		if (!this.IsActive) return;
		this.IsActive = false;
		this.Animation.Stop(0.25);
		for (const animation of this.AnimationVariants) animation.Stop(0.25);
	}
}

export { Default_Hands_Idle, Default_Hands_IdleInfo };
