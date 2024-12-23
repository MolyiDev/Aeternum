// Imports
import { ReplicateInfo } from "ReplicatedStorage/Attributes/ReplicateInfo";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";
import { EMove } from "ReplicatedStorage/Enums/MoveSets/EMove";
import { EMoveSet } from "ReplicatedStorage/Enums/MoveSets/EMoveSet";
import { IReplicateClass } from "ReplicatedStorage/Interfaces/IReplicateClass";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";
import { ModuleManager } from "ReplicatedStorage/Managers/ModuleManager";
import { BasicAttackInfo } from "ReplicatedStorage/Moves/Default/Hands/Default_Hands_BasicAttack";
import { DamageManager } from "ServerScriptService/Managers/DamageManager";
import { HitboxManager } from "ReplicatedStorage/Managers/HitboxManager";
import { StunManager } from "ServerScriptService/Managers/StunManager";

// Variables
const MoveInfo = ModuleManager.GetMoveInfo(`${EMoveSet.Default}_${EWeapon.Hands}_${EMove.BasicAttack}`)!;

@ReplicateInfo(BasicAttackInfo)
export class Default_Hands_BasicAttack implements IReplicateClass {
	public Character: Character;

	public Marks: Array<RBXScriptConnection>;

	constructor(character: Character) {
		this.Character = character;

		this.Marks = [];
	}

	public AnimPlayOnce(animTrack: AnimationTrack, animName: string): void {
		const Character = this.Character;
		const Butler = Character.Butler;
		const HumanoidRootPart = Character.HumanoidRootPart;

		const overlapParams = new OverlapParams();
		overlapParams.FilterDescendantsInstances = [Character.Model];
		overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		this.Marks.push(
			Butler.Connect(animTrack.GetMarkerReachedSignal("Damage"), () => {
				const CharactersDamaged: Character[] = [];
				const StoppedAnim = false;

				HitboxManager.Create(
					Enum.PartType.Block,
					new Vector3(4.5, 5.5, 3.5),
					HumanoidRootPart.CFrame.mul(new CFrame(0, 0, -5)),
					0.2,
					true,
					overlapParams,
					(part: Part) => {
						const hitCharacter = CharacterManager.GetCharacter(part.Parent);
						if (!hitCharacter || CharactersDamaged.includes(hitCharacter)) return;
						CharactersDamaged.push(hitCharacter);

						const hitHumanoid = hitCharacter.Humanoid;
						if (!hitHumanoid) return;

						const hitAttributes = hitCharacter.Attributes;
						if (hitAttributes.IsDashing()) return;

						if (!StoppedAnim) StunManager.Stun(Character, 0.085, EStunType.Partial);

						let Damage = 10;

						if (hitAttributes.IsBlocking()) {
							if (MoveInfo.Parryable) {
								const TickParry = tick() - hitAttributes.TickParry();
								if (TickParry <= MoveInfo.ParryTime) {
									hitAttributes.SetTickParry(tick());
									StunManager.Stun(this.Character, MoveInfo.ParryStunTime);
									return;
								}
							}

							if (MoveInfo.Blockeable) Damage /= MoveInfo.BlockDamageReduce;
						}

						DamageManager.Damage(hitCharacter, Damage);

						if (animName !== EAnimations.Default_Hands_BasicAttack3)
							DamageManager.KnockbackStun(hitCharacter, HumanoidRootPart.CFrame.LookVector.mul(25), 0.2);
						else
							DamageManager.KnockbackRagdoll(
								hitCharacter,
								HumanoidRootPart.CFrame.LookVector.mul(60),
								1.25,
								2,
							);
					},
				);
			}),
		);
	}

	public Destroy() {
		this.Character.Butler.RemoveList(this.Marks);

		this.Character = undefined!;
	}
}
