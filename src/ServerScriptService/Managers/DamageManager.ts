import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { StunManager } from "./StunManager";
import { RagdollManager } from "./RagdollManager";
import { Character } from "ReplicatedStorage/Classes/Character";
import { ReplicatedStorage } from "@rbxts/services";
import { IStyleInfo } from "ReplicatedStorage/Interfaces/IStyleInfo";
import { IAbilityInfo } from "ReplicatedStorage/Interfaces/IAbilityInfo";
import { EGlobal } from "ReplicatedStorage/Enums/Globals/EGlobal";
import { EHitResult } from "ReplicatedStorage/Enums/EHitResult";
import { EParameter } from "ReplicatedStorage/Enums/EParameter";

const KnockbackEvent = ReplicatedStorage.WaitForChild("Events")
	.WaitForChild("Combat")
	.WaitForChild("Knockback") as RemoteEvent;

export class DamageManager {
	public static Damage(character: Character, damage: number) {
		if (!character || character.IsDestroyed) return;
		const Highlight = character.Model.Highlight;
		Highlight.FillColor = Color3.fromRGB(255, 0, 0);
		Highlight.FillTransparency = 0.6;
		Tools.TweenPlay(Highlight, new TweenInfo(0.125, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
			FillTransparency: 1,
		});

		character.Humanoid.TakeDamage(damage);
		character.Parameters.Modify(EParameter.Health, -damage);
	}

	public static EvaluateHit(
		HitCharacter: Character,
		Info: IStyleInfo | IAbilityInfo,
		Damage: number = 0,
		Velocity: number = 0,
	) {
		if (Info.Dasheable && HitCharacter.Attributes.IsDashing()) return $tuple(EHitResult.Dashed, Damage, Velocity);
		if (Info.Dodgeable && HitCharacter.Attributes.IsDodging()) return $tuple(EHitResult.Dodged, Damage, Velocity);

		if (HitCharacter.Attributes.IsBlocking()) {
			if (Info.PerfectBlockeable) {
				const TickParry = tick() - HitCharacter.Attributes.TickBlock();
				if (TickParry <= EGlobal.PerfectBlockTime) {
					HitCharacter.Attributes.SetTickBlock(tick());
					Damage *= EGlobal.PerfectBlockDamageReduce;
					Velocity *= EGlobal.PerfectBlockVelocityReduce;
					return $tuple(EHitResult.PerfectBlocked, Damage, Velocity);
				}
			}

			if (Info.Blockeable) {
				Damage *= EGlobal.BlockDamageReduce;
				Velocity *= EGlobal.BlockVelocityReduce;
				return $tuple(EHitResult.Blocked, Damage, Velocity);
			}
		}

		return $tuple(EHitResult.None, Damage, Velocity);
	}

	public static Knockback(character: Character, velocity: Vector3, time: number = 0) {
		if (character.Player)
			KnockbackEvent.FireClient(character.Player, velocity.mul(character.HumanoidRootPart.AssemblyMass));
		else character.HumanoidRootPart.ApplyImpulse(velocity.mul(character.HumanoidRootPart.AssemblyMass));
	}

	public static KnockbackStun(character: Character, velocity: Vector3, time: number = 0, stunTime: number = time) {
		StunManager.Stun(character, stunTime);
		this.Knockback(character, velocity, time);
	}

	public static KnockbackRagdoll(character: Character, velocity: Vector3, time: number, ragdollTime: number = time) {
		RagdollManager.RagdollCharacter(character, ragdollTime);
		this.Knockback(character, velocity, time);
	}
}
