// Imports
import { Character } from "ReplicatedStorage/Classes/Character";
import { Attributes } from "ReplicatedStorage/Classes/Character/Attributes";
import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";
import { EAnimations } from "ReplicatedStorage/Enums/EAnimations";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { IAbility } from "ReplicatedStorage/Interfaces/IAbility";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Tools } from "ReplicatedStorage/Libraries/Tools";
import { Butler } from "ReplicatedStorage/Modules/Butler";

export class GroundSmash implements IAbility {
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

	public GetAbility() {
		return EAbility.GroundSmash;
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
