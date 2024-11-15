// Imports
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAbilityInfo } from "ReplicatedStorage/Enums/Abilities/EAbilityInfo";
import { EStopGlobal } from "ReplicatedStorage/Enums/Replicate/EStopGlobal";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

// Variables
const Ability = EAbility.SeriousPunch;
const AbilityInfo = EAbilityInfo.SeriousPunch;

export class SeriousPunch implements IReplicateClass {
	public Character: Character;
	public OverlapParams: OverlapParams;
	public PlayersDamaged: Character[];
	public MarkerDamage: RBXScriptConnection = undefined!;

	constructor(character: Character) {
		this.Character = character;

		const overlapParams = new OverlapParams();
		overlapParams.FilterDescendantsInstances = [character.Model];
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		this.OverlapParams = overlapParams;
		this.PlayersDamaged = [];
	}

	public AnimPlayOnce(animTrack: AnimationTrack) {
		const Character = this.Character;
		const Attributes = Character.Attributes;
		const Butler = Character.Butler;
		const HumanoidRootPart = Character.HumanoidRootPart;

		this.MarkerDamage = Butler.Connect(animTrack.GetMarkerReachedSignal("Damage"), () => {
			if (!Attributes.UsingAbility()) {
				if (!Attributes.IsStunnedFull()) StunManager.UnStun(Character);
				animTrack.Stop(EStopGlobal);
				return;
			}

			this.PlayersDamaged = [];

			HitboxManager.CreateMultiple(
				new Vector3(10, 5, 10),
				new Vector3(30, 15, 30),
				HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -2)),
				4,
				0.065,
				0.5,
				true,
				this.OverlapParams,
				(part, box) => this.Punch(part, box),
			);
		});
	}

	public AnimStop(animTrack: AnimationTrack) {
		const Attributes = this.Character.Attributes;

		const Cooldown = Attributes.UsingAbility() === Ability ? tick() : tick() - AbilityInfo.Cooldown / 2;
		Attributes.SetTickAnim(Ability, Cooldown);
	}

	public Punch(part: BasePart, box: number) {
		const HitCharacter = CharacterManager.GetCharacter(part.Parent);
		if (!HitCharacter || this.PlayersDamaged.includes(HitCharacter)) return;
		this.PlayersDamaged.push(HitCharacter);
		const Attributes = HitCharacter.Attributes;

		if (Attributes.IsDashing() && AbilityInfo.Dasheable) return;

		let Velocity = 100 - box * 20;

		let Damage = AbilityInfo.Damage[box];

		if (Attributes.IsBlocking()) {
			if (AbilityInfo.Parryable) {
				const TickParry = tick() - Attributes.TickParry();
				if (TickParry <= AbilityInfo.ParryTime) {
					Attributes.SetTickParry(tick());
					StunManager.Stun(this.Character, AbilityInfo.ParryStunTime);
					return;
				}
			}

			if (AbilityInfo.Blockeable) {
				Damage /= AbilityInfo.BlockDamageReduce;
				Velocity /= AbilityInfo.BlockDamageReduce;
			}
		}

		DamageManager.Damage(HitCharacter, Damage);

		const HumanoidRootPart = this.Character.HumanoidRootPart;

		if (Attributes.IsBlocking())
			DamageManager.Knockback(HitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 0.5);
		else DamageManager.KnockbackRagdoll(HitCharacter, HumanoidRootPart.CFrame.LookVector.mul(Velocity), 1, 4);
	}

	public Destroy() {
		this.Character.Butler.Remove(this.MarkerDamage);

		this.Character = undefined!;
		this.OverlapParams = undefined!;
		this.PlayersDamaged.clear();
		this.PlayersDamaged = undefined!;
	}
}
