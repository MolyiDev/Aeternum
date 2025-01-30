// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EOrder } from "ReplicatedStorage/Enums/Style/EOrder";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Default_Hands_DodgeInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Dodge";

// Variables
const StyleType = EStyleType.Dodge;
const Style = `${EStyle.Default}_${EWeapon.Hands}_${StyleType}`;
const StyleInfo = ModuleManager.GetStyleInfo(Style)!;

@ReplicateInfo(Default_Hands_DodgeInfo)
export class Default_Hands_Dodge extends CReplicate {
	private Dodged: boolean = false;
	private Dodges: Map<number, AnimationTrack>;

	constructor(character: Character) {
		super(character);
		const [Dodge1, Dodge2, Dodge3, Dodge4] = this.Animations.GetAnimations(
			EAnimations.Default_Hands_Dodge1,
			EAnimations.Default_Hands_Dodge2,
			EAnimations.Default_Hands_Dodge3,
			EAnimations.Default_Hands_Dodge4,
		);

		this.Dodges = new Map([
			[EOrder.First, Dodge1],
			[EOrder.Second, Dodge2],
			[EOrder.Third, Dodge3],
			[EOrder.Fourth, Dodge4],
		]);
	}

	public Destroy(): void {
		this.Dodges.clear();
		this.Dodges = undefined!;
	}

	public Fired(...args: Array<unknown>): void {
		if (this.Attributes.IsStunned() || !this.Attributes.IsBlocking()) return;
		this.Dodged = false;
		this.SetUsingStyle(EStyleType.Dodge);
		/*task.delay(0.2, () => {
			if (!this.Dodged) this.SetCooldown(anim, cooldown);
			if (this.Attributes.UsingStyle() === EStyleType.Dodge) {
				this.SetUsingStyle(undefined);
				this.SetCooldown(anim, cooldown);
			}
		});*/
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		this.Dodged = true;
		this.Attributes.SetTickBlock(tick());
	}

	public AnimStop(animTrack: AnimationTrack, animName: string) {
		if (animName === EAnimations.Default_Hands_BlockBottom) return;
		this.Attributes.SetIsBlocking(false);
	}
}
