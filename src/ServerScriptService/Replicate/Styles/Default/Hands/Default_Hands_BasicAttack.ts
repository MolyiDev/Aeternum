// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EStyleType } from "ReplicatedStorage/Enums/Style/EStyleType";
import { EStyle } from "ReplicatedStorage/Enums/Style/EStyle";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { CReplicate } from "ReplicatedStorage/Classes/Abstracts/CReplicate";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { HitboxManager } from "ServerScriptService/Managers/HitboxManager";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { Default_Hands_BasicAttackInfo } from "ReplicatedStorage/Styles/Default/Hands/Default_Hands_BasicAttack";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { ECollisionGroup } from "ReplicatedStorage/Enums/ECollisionGroup";
import { EOrder } from "ReplicatedStorage/Enums/Style/EOrder";
import { EHitResult } from "ReplicatedStorage/Enums/EHitResult";

// Variables
const StyleType = EStyleType.BasicAttack;
const Style = `${EStyle.Default}_${EWeapon.Hands}_${StyleType}`;
const StyleInfo = ModuleManager.GetStyleInfo(Style)!;
const TWEEN = new TweenInfo(0.275, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);

const PUNCH_TIMEOUT = 1.75;

@ReplicateInfo(Default_Hands_BasicAttackInfo)
export class Default_Hands_BasicAttack extends CReplicate {
	public Marks: Array<RBXScriptConnection> = [];
	public OverlapParams: OverlapParams = new OverlapParams();

	private BasicAttacks: Map<number, AnimationTrack>;
	private ComboAttack: AnimationTrack;
	private AirAttack: AnimationTrack;
	private CharactersReceivedAttacks: Map<string, number> = new Map();
	private HittedCombo: boolean = false;
	private Knockback: boolean = false;
	private CurrentAttack: number = EOrder.None;
	private LastPunchTime: number = tick();
	private ComboCharacter: Character = undefined!;

	constructor(character: Character) {
		super(character);

		const [Attack1, Attack2, Attack3, Attack4, ComboAttack, AirAttack] = character.Animations.GetAnimations(
			EAnimations.Default_Hands_BasicAttack1,
			EAnimations.Default_Hands_BasicAttack2,
			EAnimations.Default_Hands_BasicAttack3,
			EAnimations.Default_Hands_BasicAttack4,
			EAnimations.Default_Hands_AttackCombo,
			EAnimations.Default_Hands_AirAttack,
		);

		this.BasicAttacks = new Map([
			[EOrder.First, Attack1],
			[EOrder.Second, Attack2],
			[EOrder.Third, Attack3],
			[EOrder.Fourth, Attack4],
		]);

		this.ComboAttack = ComboAttack;
		this.AirAttack = AirAttack;

		this.OverlapParams.AddToFilter(this.Model);
		this.OverlapParams.FilterType = Enum.RaycastFilterType.Exclude;
	}

	public Destroy() {
		this.Butler.RemoveList(this.Marks);
		this.Marks.clear();
		this.BasicAttacks.clear();
		this.CharactersReceivedAttacks.clear();

		this.Marks = undefined!;
		this.OverlapParams = undefined!;
		this.BasicAttacks = undefined!;
		this.ComboAttack = undefined!;
		this.AirAttack = undefined!;
		this.CharactersReceivedAttacks = undefined!;
		this.HittedCombo = undefined!;
		this.CurrentAttack = undefined!;
		this.LastPunchTime = undefined!;
	}

	public Fired(): void {
		if (this.Attributes.IsStunned() || this.Attributes.IsBlocking() || this.Attributes.UsingStyle()) return;
		if (!this.States.IsGrounded()) {
			if (this.CurrentAttack === EOrder.Third) {
				StunManager.Stun(this.Character, 0.8, EStunType.Partial);
				this.AirAttack.Play(0.2, 1, 1.85);
				this.ResetAttack();

				return;
			} else {
				// AirAttack
			}
		}

		if (this.CurrentAttack === EOrder.Fourth) this.ResetAttack();
		if (tick() - this.LastPunchTime >= PUNCH_TIMEOUT && this.CurrentAttack !== EOrder.None) this.ResetAttack();

		this.Knockback = false;
		this.LastPunchTime = tick();

		const PrevPunch = this.BasicAttacks.get(this.CurrentAttack);
		const NewAttack = this.BasicAttacks.get(this.CurrentAttack + 1)!;

		this.CurrentAttack++;

		this.SetUsingStyle(StyleType, NewAttack.Name);

		if (PrevPunch) PrevPunch.Stop(0.2);
		NewAttack.Play(0.2, 1, 1.2);
	}

	public ResetAttack() {
		this.CurrentAttack = EOrder.None;
		this.HittedCombo = false;
		this.CharactersReceivedAttacks.clear();
	}

	public AnimStop(animTrack: AnimationTrack, animName: string): void {
		if (this.Attributes.UsingStyleAnim() === animName) this.SetUsingStyle(undefined);
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string): void {
		this.Marks.push(
			this.Butler.Connect(animTrack.GetMarkerReachedSignal("EndAttack"), () => {
				if (this.Attributes.UsingStyleAnim() === animName) this.SetUsingStyle(undefined);

				if (
					animName === EAnimations.Default_Hands_AttackCombo ||
					animName === EAnimations.Default_Hands_AirAttack ||
					(animName === EAnimations.Default_Hands_BasicAttack4 && this.ComboCharacter === undefined)
				) {
					this.SetCooldown(
						Style,
						this.Attributes.UsingStyle() === Style ? tick() : tick() - StyleInfo.Cooldown / 2,
					);
				}
			}),
		);

		if (animName === EAnimations.Default_Hands_AttackCombo) {
			this.Marks.push(
				this.Butler.Connect(animTrack.GetMarkerReachedSignal("Attack"), (param) => {
					DamageManager.Damage(this.ComboCharacter, 2 * tonumber(param)!);
					if (param !== "5") return;
					DamageManager.KnockbackRagdoll(
						this.ComboCharacter,
						this.HumanoidRootPart.CFrame.LookVector.add(this.HumanoidRootPart.CFrame.UpVector).mul(200),
						0,
						2,
					);
				}),
			);
			return;
		}

		if (animName === EAnimations.Default_Hands_AirAttack) {
			this.Marks.push(
				this.Butler.Connect(animTrack.GetMarkerReachedSignal("Attack"), (param) => {
					const CharactersDamaged: Character[] = [];

					HitboxManager.Create(
						Enum.PartType.Block,
						new Vector3(4, 8, 3.5),
						this.HumanoidRootPart.CFrame.mul(new CFrame(0, -1, -4)),
						0.1,
						true,
						this.HumanoidRootPart,
						this.OverlapParams,
						(part: Part) => {
							const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
							if (!HitCharacter || CharactersDamaged.includes(HitCharacter)) return;
							CharactersDamaged.push(HitCharacter);

							const HitHumanoid = HitCharacter.Humanoid;
							if (!HitHumanoid) return;

							const [HitResult, Damage] = DamageManager.EvaluateHit(
								HitCharacter,
								StyleInfo,
								StyleInfo.Damage[0],
							);

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

							DamageManager.KnockbackRagdoll(HitCharacter, KnockbackDirection.mul(50), 1, 2);
						},
					);
				}),
			);

			return;
		}

		this.Marks.push(
			this.Butler.Connect(animTrack.GetMarkerReachedSignal("Attack"), () => {
				const CharactersDamaged: Character[] = [];

				HitboxManager.Create(
					Enum.PartType.Block,
					new Vector3(3.8, 3.8, 4.35),
					this.HumanoidRootPart.CFrame.mul(new CFrame(0, 0.5, -4.25)),
					0.1,
					true,
					this.HumanoidRootPart,
					this.OverlapParams,
					(part: Part) => {
						const HitCharacter = CharacterManager.GetCharacterByModel(part.Parent);
						if (!HitCharacter || CharactersDamaged.includes(HitCharacter)) return;
						CharactersDamaged.push(HitCharacter);

						const HitHumanoid = HitCharacter.Humanoid;
						if (!HitHumanoid) return;

						const [HitResult, Damage] = DamageManager.EvaluateHit(
							HitCharacter,
							StyleInfo,
							StyleInfo.Damage[0],
						);

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

						const HitAnimations = HitCharacter.Animations;
						const HitHumanoidRootPart = HitCharacter.HumanoidRootPart;
						HitAnimations.GetAnimation(`ReceiveAttack${new Random().NextInteger(1, 4)}`).Play();
						HitCharacter.Attributes.SetReceive("ReceiveAttack");

						if (this.CurrentAttack === EOrder.First)
							this.CharactersReceivedAttacks.set(HitCharacter.CharacterId, this.CurrentAttack);
						else if (
							this.CurrentAttack === EOrder.Fourth &&
							this.CharactersReceivedAttacks.get(HitCharacter.CharacterId) === EOrder.Third &&
							!this.HittedCombo
						) {
							this.HittedCombo = true;

							StunManager.Stun(HitCharacter, 4);
							StunManager.Stun(this.Character, 4, EStunType.Partial);

							task.wait(0.225);

							const HitModel = HitCharacter.Model;
							this.ComboCharacter = HitCharacter;

							HitModel.UpperTorso.CollisionGroup = ECollisionGroup.PlayerNoCollision;
							HitModel.LowerTorso.CollisionGroup = ECollisionGroup.PlayerNoCollision;
							HitModel.Head.CollisionGroup = ECollisionGroup.PlayerNoCollision;
							HitHumanoidRootPart.CollisionGroup = ECollisionGroup.PlayerNoCollision;

							const ReceiveAttackCombo = HitAnimations.GetAnimation(
								EAnimations.Default_Hands_ReceiveAttackCombo,
							);

							HitCharacter.Attributes.SetReceive(EAnimations.Default_Hands_ReceiveAttackCombo);

							const newPosition = this.HumanoidRootPart.CFrame.Position.add(
								this.HumanoidRootPart.CFrame.LookVector.mul(4.4),
							);

							const TargetPos = new CFrame(
								newPosition,
								newPosition.sub(this.HumanoidRootPart.CFrame.LookVector),
							);

							Tools.TweenPlay(HitHumanoidRootPart, TWEEN, { CFrame: TargetPos });

							this.ComboAttack.Play(0.15, 1, 0.75);
							ReceiveAttackCombo.Play(0.15, 1, 0.75);

							const HitStop = HitCharacter.Butler.Once(ReceiveAttackCombo.Stopped, () => {
								HitCharacter.Butler.Remove(HitStop);

								HitModel.UpperTorso.CollisionGroup = ECollisionGroup.Player;
								HitModel.LowerTorso.CollisionGroup = ECollisionGroup.Player;
								HitModel.Head.CollisionGroup = ECollisionGroup.Player;
								HitHumanoidRootPart.CollisionGroup = ECollisionGroup.Player;
								this.ComboCharacter = undefined!;
							});
							return;
						} else {
							const Number = this.CharactersReceivedAttacks.get(HitCharacter.CharacterId);
							if (Number && Number === this.CurrentAttack - 1)
								this.CharactersReceivedAttacks.set(HitCharacter.CharacterId, this.CurrentAttack);
						}

						const KnockbackDirection = HitHumanoidRootPart.CFrame.Position.sub(
							this.HumanoidRootPart.CFrame.Position,
						).Unit;

						if (!this.Knockback) {
							this.Knockback = true;

							DamageManager.Knockback(this.Character, KnockbackDirection.mul(45));
						}

						if (animName !== EAnimations.Default_Hands_BasicAttack4)
							DamageManager.KnockbackStun(HitCharacter, KnockbackDirection.mul(47.5));
						else DamageManager.KnockbackRagdoll(HitCharacter, KnockbackDirection.mul(200), 1, 1.5);
					},
				);
			}),
		);
	}
}
