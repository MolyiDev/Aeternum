import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { StunManager } from "./StunManager";
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

		print("Character Damaged -", character);
		character.Humanoid.TakeDamage(damage);
		print(`Damaged: ${character.Model.Name}`, damage);
	}

	public static Knockback(character: Character, velocity: Vector3, time: number) {
		const knockbackVelocity = new Instance("BodyVelocity", character.HumanoidRootPart);
		knockbackVelocity.MaxForce = new Vector3(math.huge, math.huge, math.huge);
		knockbackVelocity.Velocity = velocity;

		Collector.AddItem(knockbackVelocity, time);
	}

	public static KnockbackStun(character: Character, velocity: Vector3, time: number, stunTime: number = time) {
		StunManager.Stun(character, stunTime);
		this.Knockback(character, velocity, time);
	}

	public static KnockbackRagdoll(character: Character, velocity: Vector3, time: number, ragdollTime: number = time) {
		RagdollManager.RagdollCharacter(character, ragdollTime);
		this.Knockback(character, velocity, time);
	}
}
