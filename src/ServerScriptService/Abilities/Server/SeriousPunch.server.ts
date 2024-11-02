/*// Imports
import { HitboxManager } from "server/ServerScriptService/Managers/HitboxManager";
import { IModel } from "shared/Interfaces/IModel";
import { DamageManager } from "server/ServerScriptService/Managers/DamageManager";
import { StunManager } from "server/ServerScriptService/Managers/StunManager";
import { EAbilityInfo } from "shared/Enums/Abilities/EAbilityInfo";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { AnimManager } from "shared/Managers/AnimManager";

// Variables
const Ability = EAbility.SeriousPunch;
const AbilityInfo = EAbilityInfo.SeriousPunch;

AnimManager.AnimationPlayOnce.Connect((character, animName, animTrack) => {
	if (animName !== Ability) return;
	const Attributes = character.Attributes;
	const Butler = character.Butler;
	const Model = character.Model;

	const HumanoidRootPart = character.HumanoidRootPart;

	const overlapParams = new OverlapParams();
	overlapParams.FilterDescendantsInstances = [Model];
	overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

	let PlayersDamaged: Humanoid[] = [];

	function Punch(part: BasePart, box: number) {
		const hitCharacter = part.Parent as IModel;
		if (!hitCharacter) return;
		const hitHumanoid = hitCharacter.Humanoid;
		if (!hitHumanoid || PlayersDamaged.includes(hitHumanoid)) return;
		PlayersDamaged.push(hitHumanoid);
		if (AttributeManager.IsDashing(hitCharacter) && AbilityInfo.Dasheable) return;

		let Velocity = 100 - box * 20;

		let Damage = AbilityInfo.Damage[box];

		if (AttributeManager.IsBlocking(hitCharacter)) {
			if (AbilityInfo.Parryable) {
				const TickParry = tick() - AttributeManager.TickParry(hitCharacter);
				if (TickParry <= AbilityInfo.ParryTime) {
					AttributeManager.SetTickParry(hitCharacter, tick());
					StunManager.Stun(character, AbilityInfo.ParryStunTime);
					return;
				}
			}

			if (AbilityInfo.Blockeable) {
				Damage /= AbilityInfo.BlockDamageReduce;
				Velocity /= AbilityInfo.BlockDamageReduce;
			}
		}

		DamageManager.Damage(hitCharacter, Damage);

		if (AttributeManager.IsBlocking(hitCharacter))
			DamageManager.Knockback(hitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 0.5);
		else DamageManager.KnockbackRagdoll(hitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 1, 4);
	}

	Butler.Add(
		animTrack.GetMarkerReachedSignal("Damage").Connect(() => {
			PlayersDamaged = [];

			HitboxManager.CreateMultiple(
				new Vector3(10, 5, 10),
				new Vector3(30, 15, 30),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -2)),
				4,
				0.065,
				0.5,
				true,
				overlapParams,
				(part, box) => Punch(part, box),
			);
		}),
	);
});*/
