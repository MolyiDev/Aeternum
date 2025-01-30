// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Default_Hands_BlockInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_Block";

// Variables
const StyleType = EStyleType.Block;
const Style = `${EStyle.Default}_${EWeapon.Hands}_${StyleType}`;
const StyleInfo = ModuleManager.GetStyleInfo(Style)!;

@ReplicateInfo(Default_Hands_BlockInfo)
export class Default_Hands_Block extends CReplicate {
	public IsActive: boolean = false;
	public AnimationUpper: AnimationTrack = this.Animations.GetAnimation(EAnimations.Default_Hands_BlockUpper);

	public Destroy(): void {
		this.AnimationUpper.Stop(0.25);
		this.IsActive = undefined!;
		this.AnimationUpper = undefined!;
	}

	public Fired(...args: Array<unknown>): void {
		if (args.size() < 2 || this.Attributes.IsStunned()) return;
		const Activate = args[1] as boolean;
		if (!typeIs(Activate, "boolean")) return;

		if (Activate) {
			if (this.IsActive) return;
			this.AnimationUpper.Play(0.25, 1, 1.4);
			this.IsActive = true;
			this.SetUsingStyle(StyleType, this.AnimationUpper.Name);
		} else {
			if (!this.IsActive) return;
			this.AnimationUpper.Stop(0.25);
			this.IsActive = false;
			this.SetUsingStyle(undefined);
		}
	}

	public AnimPlay(animTrack: AnimationTrack, animName: string): void {
		if (animName === EAnimations.Default_Hands_BlockBottom) return;
		this.Attributes.SetIsBlocking(true);
		this.Attributes.SetTickBlock(tick());
	}

	public AnimStop(animTrack: AnimationTrack, animName: string) {
		if (animName === EAnimations.Default_Hands_BlockBottom) return;
		this.IsActive = false;
		this.Attributes.SetIsBlocking(false);
	}
}
