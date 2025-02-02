// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EHitResult } from "ReplicatedStorage/Enums/EHitResult";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { Default_Hands_RunAttackInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_RunAttack";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";

const StyleType = EStyleType.RunAttack;
const Style = `${EStyle.Default}_${EWeapon.Hands}_${StyleType}`;
const StyleInfo = ModuleManager.GetStyleInfo(Style)!;

@ReplicateInfo(Default_Hands_RunAttackInfo)
export class Default_Hands_RunAttack extends CReplicate {
	public MarkAttack: RBXScriptConnection = undefined!;
	public RunAttack: AnimationTrack = this.Animations.GetAnimation(EAnimations.Default_Hands_RunAttack);
	public OverlapParams: OverlapParams = new OverlapParams();

	constructor(character: Character) {
		super(character);
		this.OverlapParams.AddToFilter(this.Model);
		this.OverlapParams.FilterType = Enum.RaycastFilterType.Exclude;
	}

	public Destroy(): void {
		this.Butler.Remove(this.MarkAttack);
		this.MarkAttack = undefined!;
		this.RunAttack.Stop(0.25);
		this.RunAttack = undefined!;
	}

	public Fired() {
		if (this.Attributes.IsStunned() || !this.States.IsGrounded() || this.Attributes.UsingStyle()) return false;
		this.SetUsingStyle(StyleType, this.RunAttack.Name);

		this.RunAttack.Play(0.2, 1, 1.55);
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		this.SetUsingStyle(undefined);
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string): void {
		this.MarkAttack = this.Butler.Connect(animTrack.GetMarkerReachedSignal("Attack"), () => {
			const CharactersDamaged: Character[] = [];

			HitboxManager.Create(
				Enum.PartType.Block,
				new Vector3(4, 4, 5),
				this.HumanoidRootPart.CFrame.mul(new CFrame(0, -0.5, -4.25)),
				0.1,
				this.HumanoidRootPart,
				this.OverlapParams,
				(part: Part) => {
					const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
					if (!HitCharacter || CharactersDamaged.includes(HitCharacter)) return;
					CharactersDamaged.push(HitCharacter);

					const HitHumanoid = HitCharacter.Humanoid;
					if (!HitHumanoid) return;

					const [HitResult, Damage] = DamageManager.EvaluateHit(HitCharacter, StyleInfo, StyleInfo.Damage[0]);

					switch (HitResult) {
						case EHitResult.None:
						case EHitResult.Blocked:
							break;
						case EHitResult.Dashed:
						case EHitResult.Dodged:
						case EHitResult.PerfectBlocked:
							return;
					}

					DamageManager.Damage(HitCharacter, Damage);

					const KnockbackDirection = HitCharacter.HumanoidRootPart.CFrame.Position.sub(
						this.HumanoidRootPart.CFrame.Position,
					).Unit;

					DamageManager.Knockback(HitCharacter, KnockbackDirection.mul(150));
				},
			);
		});
	}
}
