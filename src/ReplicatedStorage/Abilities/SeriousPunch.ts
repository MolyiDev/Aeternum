// Imports
import { AbilityInfo } from "ReplicatedStorage/Attributes/AbilityInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EWeapons } from "ReplicatedStorage/Enums/EWeapons";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

const Cooldown = 5;

const SeriousPunchInfo = {
	[EAnimations.SeriousPunch]: {
		Ability: true,
		CanFeint: true,
		Sound: true,
		Cooldown: Cooldown,
	},
};

@AbilityInfo(EAbility.SeriousPunch, {
	Weapon: EWeapons.Hands,
	Cooldown: Cooldown,
	Damage: [40, 35, 30, 20],
	ParryStunTime: 0.25,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 4,
	Blockeable: true,
	Dasheable: true,
})
class SeriousPunch implements IAbility {
	public Name = script.Name;
	private Attributes: Attributes;
	private Humanoid: IHumanoid;
	private SeriousPunch: AnimationTrack;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
		this.Humanoid = character.Humanoid;
		this.SeriousPunch = character.Animations.GetAnimation(EAnimations.SeriousPunch);
	}

	public Start() {
		if (this.Attributes.IsStunned() || !Tools.IsTouchingGround(this.Humanoid, true)) return;

		this.Attributes.SelfStun(1.45, EStunType.Partial);
		this.SeriousPunch.Play();
	}

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
		this.SeriousPunch = undefined!;
	}
}

export { SeriousPunch, SeriousPunchInfo };
