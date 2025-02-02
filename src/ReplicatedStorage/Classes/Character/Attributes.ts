import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage } from "@rbxts/services";
import { EAttribute } from "ReplicatedStorage/Enums/EAttribute";
import { EStunType } from "ReplicatedStorage/Enums/EStunType";
import { IModel } from "ReplicatedStorage/Interfaces/IModel";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const SelfStun = Events.WaitForChild("SelfStun") as RemoteEvent;

export class Attributes {
	public Model: IModel;
	public AttributeChanged: Signal<string>;

	constructor(model: IModel) {
		this.Model = model;
		this.AttributeChanged = Signal.wrap(model.AttributeChanged);
	}

	public IsStunned(): boolean {
		return (
			(this.Model.GetAttribute(EAttribute.IsStunnedFull) as boolean) ||
			(this.Model.GetAttribute(EAttribute.IsStunnedPartial) as boolean) ||
			(this.Model.GetAttribute(EAttribute.IsStunnedSemiPartial) as boolean)
		);
	}

	public IsStunnedFull = () => this.Model.GetAttribute(EAttribute.IsStunnedFull) as boolean;
	public SetStunnedFull = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsStunnedFull, bool);

	public IsStunnedPartial = () => this.Model.GetAttribute(EAttribute.IsStunnedPartial) as boolean;
	public SetStunnedPartial = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsStunnedPartial, bool);

	public IsStunnedSemiPartial = () => this.Model.GetAttribute(EAttribute.IsStunnedSemiPartial) as boolean;
	public SetStunnedSemiPartial = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsStunnedSemiPartial, bool);

	public Attacker = () => this.Model.GetAttribute(EAttribute.Attacker) as string | undefined;
	public SetAttacker = (attackerId: string | undefined) => this.Model.SetAttribute(EAttribute.Attacker, attackerId);

	// Is

	public IsDashing = () => this.Model.GetAttribute(EAttribute.IsDashing) as boolean;
	public SetIsDashing = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsDashing, bool);

	public IsBlocking = () => this.Model.GetAttribute(EAttribute.IsBlocking) as boolean;
	public SetIsBlocking = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsBlocking, bool);

	public IsRagdoll = () => this.Model.GetAttribute(EAttribute.IsRagdoll) as boolean;
	public SetIsRagdoll = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsRagdoll, bool);

	public IsDodging = () => this.Model.GetAttribute(EAttribute.IsDodging) as boolean;
	public SetIsDodging = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsDodging, bool);

	// Using

	public UsingAbility = () => this.Model.GetAttribute(EAttribute.UsingAbility) as string | undefined;
	public SetUsingAbility = (ability: string | undefined) => this.Model.SetAttribute(EAttribute.UsingAbility, ability);

	public UsingAbilityAnim = () => this.Model.GetAttribute(EAttribute.UsingAbilityAnim) as string | undefined;
	public SetUsingAbilityAnim = (ability: string | undefined) =>
		this.Model.SetAttribute(EAttribute.UsingAbilityAnim, ability);

	public UsingStyle = () => this.Model.GetAttribute(EAttribute.UsingStyle) as string | undefined;
	public SetUsingStyle = (style: string | undefined) => this.Model.SetAttribute(EAttribute.UsingStyle, style);

	public UsingStyleAnim = () => this.Model.GetAttribute(EAttribute.UsingStyleAnim) as string | undefined;
	public SetUsingStyleAnim = (style: string | undefined) => this.Model.SetAttribute(EAttribute.UsingStyleAnim, style);

	// IsCamera

	public IsCameraLocked = () => this.Model.GetAttribute(EAttribute.IsCameraLocked) as boolean;

	public SetIsCameraLocked = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsCameraLocked, bool);

	public IsAutoRotate = () => this.Model.GetAttribute(EAttribute.AutoRotate) as boolean;

	public SetAutoRotate = (bool: boolean) => this.Model.SetAttribute(EAttribute.AutoRotate, bool);

	// Ticks

	public TickAnim = (anim: string) => (this.Model.GetAttribute(anim) as number) ?? 0;
	public SetTickAnim = (anim: string, tick: number | undefined) => this.Model.SetAttribute(anim, tick);

	public TickBlock = () => this.Model.GetAttribute(EAttribute.Tick_Block) as number;
	public SetTickBlock = (tick: number) => this.Model.SetAttribute(EAttribute.Tick_Block, tick);

	// Can

	public IgnoreLandStun = () => this.Model.GetAttribute(EAttribute.IgnoreLandStun);
	public SetIgnoreLandStun = (bool: boolean) => this.Model.SetAttribute(EAttribute.IgnoreLandStun, bool);

	// Other

	public SelfStun(time: number, stunType: EStunType = EStunType.Full, sendServer: boolean = true) {
		switch (stunType) {
			case EStunType.Full:
				this.SetStunnedFull(true);
				break;
			case EStunType.Partial:
				this.SetStunnedPartial(true);
				break;
			case EStunType.SemiPartial:
				this.SetStunnedSemiPartial(true);
				break;
		}

		if (sendServer) SelfStun.FireServer(time, stunType);
		else {
			task.delay(time, () => {
				if (!this.Model) return;

				switch (stunType) {
					case EStunType.Full:
						this.SetStunnedFull(false);
						break;
					case EStunType.Partial:
						this.SetStunnedPartial(false);
						break;
					case EStunType.SemiPartial:
						this.SetStunnedSemiPartial(false);
						break;
				}
			});
		}
	}

	// Destroy

	public Destroy() {
		this.AttributeChanged.Destroy();
		this.Model = undefined!;
		this.AttributeChanged = undefined!;
	}
}
