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
import { Butler } from "ReplicatedStorage/Modules/Butler";

const Cooldown = 5;

const GroundSmashInfo = {
	[EAnimations.GroundSmash]: {
		Ability: true,
		CanFeint: true,
		Sound: true,
		Cooldown: Cooldown,
		Class: "GroundSmash",
	},
	[EAnimations.GroundSmashIdle]: {
		Ability: true,
		Sound: true,
		HasFeintStop: false,
		Cooldown: Cooldown,
		Class: "GroundSmash",
	},
	[EAnimations.GroundSmashLand]: {
		Ability: true,
		Sound: true,
		Cooldown: Cooldown,
		Class: "GroundSmash",
	},
};

@AbilityInfo(EAbility.GroundSmash, {
	Weapon: EWeapons.Hands,
	Cooldown: Cooldown,
	Damage: [50, 30, 10],
	ParryStunTime: 0.85,
	ParryTime: 0.2,
	Parryable: true,
	BlockDamageReduce: 4,
	Blockeable: true,
	Dasheable: true,
})
class GroundSmash implements IAbility {
	public Name = script.Name;
	private Attributes: Attributes;
	private Humanoid: IHumanoid;
	private Butler: Butler;
	private VectorForce: VectorForce;
	private StateChanged: RBXScriptConnection = undefined!;
	private GroundSmashIdle: AnimationTrack;
	private GroundSmashLand: AnimationTrack;
	private GroundSmash: AnimationTrack;

	constructor(character: Character) {
		this.Attributes = character.Attributes;
		this.Humanoid = character.Humanoid;
		this.Butler = character.Butler;

		const VectorForce = new Instance("VectorForce", character.HumanoidRootPart);
		const Attachment = character.HumanoidRootPart.FindFirstChild("RootAttachment")!.Clone() as Attachment;
		Attachment.Parent = character.HumanoidRootPart;
		VectorForce.Attachment0 = Attachment;
		VectorForce.Enabled = false;
		this.VectorForce = VectorForce;

		const Animations = character.Animations;
		this.GroundSmashIdle = Animations.GetAnimation(EAnimations.GroundSmashIdle);
		this.GroundSmashLand = Animations.GetAnimation(EAnimations.GroundSmashLand);
		this.GroundSmash = Animations.GetAnimation(EAnimations.GroundSmash);
	}

	public Start() {
		if (this.Attributes.IsStunned()) return;
		const TouchGround = Tools.IsTouchingGround(this.Humanoid, true);
		if (TouchGround) {
			this.Attributes.SelfStun(4.5, EStunType.Partial);
			this.GroundSmash.Play();
		} else {
			this.Attributes.SetCanLandStun(false);
			this.GroundSmashIdle.Play(0.25);
			this.VectorForce.Force = new Vector3(0, -4000, 0);
			this.VectorForce.Enabled = true;
			this.StateChanged = this.Butler.Connect(this.Humanoid.StateChanged, () => this.Land());
		}
	}

	public Destroy() {
		this.Attributes = undefined!;
		this.Humanoid = undefined!;
		this.GroundSmashIdle = undefined!;
		this.GroundSmash = undefined!;
	}

	public Land() {
		this.Butler.Remove(this.StateChanged);
		this.Attributes.SelfStun(0.75, EStunType.Partial);
		this.VectorForce.Enabled = false;
		this.GroundSmashIdle.Stop();
		this.GroundSmashLand.Play();
		task.delay(1, () => {
			if (this.Attributes) this.Attributes.SetCanLandStun(true);
		});
	}
}

export { GroundSmash, GroundSmashInfo };
