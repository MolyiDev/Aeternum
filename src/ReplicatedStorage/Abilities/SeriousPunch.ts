// Imports
import { Players } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

export class SeriousPunch implements IAbility {
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

	public GetAbility() {
		return EAbility.SeriousPunch;
	}

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
		this.SeriousPunch = undefined!;
	}
}
