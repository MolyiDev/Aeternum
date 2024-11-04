// Imports
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";

export class GroundSmash implements IAbility {
	private Attributes: Attributes;
	private Humanoid: IHumanoid;
	private GroundSmashIdle: AnimationTrack;
	private GroundSmash: AnimationTrack;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
		this.Humanoid = character.Humanoid;

		const Animations = character.Animations;
		this.GroundSmashIdle = Animations.GetAnimation(EAnimations.GroundSmashIdle);
		this.GroundSmash = Animations.GetAnimation(EAnimations.GroundSmash);
	}

	public Start() {
		if (this.Attributes.IsStunned()) return;
		const TouchGround = Tools.IsTouchingGround(this.Humanoid, true);
		if (TouchGround) {
			this.Attributes.SelfStun(4.5, EStunType.Partial);
			this.GroundSmash.Play();
		} else this.GroundSmashIdle.Play();
	}

	public GetAbility() {
		return EAbility.GroundSmash;
	}

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
		this.GroundSmashIdle = undefined!;
		this.GroundSmash = undefined!;
	}
}
