import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { StunManager } from "./StunManager";
import { Debris } from "@rbxts/services";
import { RagdollManager } from "./RagdollManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import Collector from "ReplicatedStorage/Libraries/Collector";

export class DamageManager {
	public static Damage(character: Character, damage: number) {
		const Highlight = character.Model.Highlight;
		Highlight.FillColor = Color3.fromRGB(255, 0, 0);
		Highlight.FillTransparency = 0.6;
		Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			FillTransparency: 1,
		});

		character.Humanoid.TakeDamage(damage);
		print(`Damaged: ${character.Model.Name}`, damage);
	}

	public static Knockback(character: Character, velocity: Vector3, time: number) {
		const knockbackVelocity = new Instance("BodyVelocity", character.HumanoidRootPart);
		knockbackVelocity.MaxForce = new Vector3(math.huge, math.huge, math.huge);
		knockbackVelocity.Velocity = velocity;

		Tools.TweenPlay(knockbackVelocity, new TweenInfo(time, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			Velocity: Vector3.zero,
		});

		Collector.AddItem(knockbackVelocity, time);
	}

	public static KnockbackStun(character: Character, velocity: Vector3, time: number, stunTime: number = time) {
		this.Knockback(character, velocity, time);
		StunManager.Stun(character, stunTime);
	}

	public static KnockbackRagdoll(character: Character, velocity: Vector3, time: number, ragdollTime: number = time) {
		this.Knockback(character, velocity, time);
		RagdollManager.RagdollCharacter(character, ragdollTime);
	}
}
