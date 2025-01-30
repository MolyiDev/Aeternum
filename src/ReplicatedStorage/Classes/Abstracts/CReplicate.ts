import { Character } from "ReplicatedStorage/Classes/Character";
import { CBase } from "./CBase";

export abstract class CReplicate extends CBase {
	constructor(character: Character) {
		super(character);
	}

	public SelfConstruct?(): void;

	public Fired?(...args: Array<unknown>): void;
	public FiredServer?(...args: Array<unknown>): void;

	public AnimPlay?(animTrack: AnimationTrack, animName: string): void;
	public AnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	public AnimStop?(animTrack: AnimationTrack, animName: string): void;

	public SelfAnimPlay?(animTrack: AnimationTrack, animName: string): void;
	public SelfAnimPlayOnce?(animTrack: AnimationTrack, animName: string): void;
	public SelfAnimStop?(animTrack: AnimationTrack, animName: string): void;

	public SetUsingAbility(replicateName: string | undefined, animName: string | undefined = replicateName) {
		this.Attributes.SetUsingAbility(replicateName);
		this.Attributes.SetUsingAbilityAnim(animName);
	}

	public SetUsingStyle(replicateName: string | undefined, animName: string | undefined = replicateName) {
		this.Attributes.SetUsingStyle(replicateName);
		this.Attributes.SetUsingStyleAnim(animName);
	}

	public SetCooldown(anim: string, cooldown: number) {
		this.Attributes.SetTickAnim(anim, cooldown);
	}

	public Destroy() {
		super.Destroy();
	}

	public SelfDestroy(): void {}
}
