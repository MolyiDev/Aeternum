import Signal from "@rbxts/lemon-signal";
import { ReplicatedStorage } from "@rbxts/services";
import { EAbility } from "shared/Enums/Abilities/EAbility";
import { EAttribute } from "shared/Enums/EAttribute";
import { EStunType } from "shared/Enums/EStunType";
import { IModel } from "shared/Interfaces/IModel";

// Events
const Events = ReplicatedStorage.WaitForChild("Events");
const SelfStun = Events.WaitForChild("SelfStun") as RemoteEvent;

export class Attributes {
	public Model: IModel;
	public AttributeChanged: Signal<[attribute: string]>;

	constructor(model: IModel) {
		this.Model = model;
		this.AttributeChanged = Signal.wrap(model.AttributeChanged);
	}

	public IsStunned() {
		return (
			(this.Model.GetAttribute(EAttribute.IsStunnedFull) as boolean) ||
			(this.Model.GetAttribute(EAttribute.IsStunnedPartial) as boolean)
		);
	}

	public IsStunnedFull = () => this.Model.GetAttribute(EAttribute.IsStunnedFull) as boolean;

	public SetStunnedFull = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsStunnedFull, bool);

	public IsStunnedPartial = () => this.Model.GetAttribute(EAttribute.IsStunnedPartial) as boolean;

	public SetStunnedPartial = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsStunnedPartial, bool);

	// Is

	public IsDashing = () => this.Model.GetAttribute(EAttribute.IsDashing) as boolean;

	public SetIsDashing = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsDashing, bool);

	public IsBlocking = () => this.Model.GetAttribute(EAttribute.IsBlocking) as boolean;

	public SetIsBlocking = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsBlocking, bool);

	public IsRagdoll = () => this.Model.GetAttribute(EAttribute.IsRagdoll) as boolean;

	public SetIsRagdoll = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsRagdoll, bool);

	// IsCamera

	public IsCameraLocked = () => this.Model.GetAttribute(EAttribute.IsCameraLocked) as boolean;

	public SetIsCameraLocked = (bool: boolean) => this.Model.SetAttribute(EAttribute.IsCameraLocked, bool);

	public IsAutoRotate = () => this.Model.GetAttribute(EAttribute.AutoRotate) as boolean;

	public SetAutoRotate = (bool: boolean) => this.Model.SetAttribute(EAttribute.AutoRotate, bool);

	// Ticks

	public TickParry = () => this.Model.GetAttribute(EAttribute.Tick_Parry) as number;

	public SetTickParry = (tick: number) => this.Model.SetAttribute(EAttribute.Tick_Parry, tick);

	public TickAttackStealth = () => this.Model.GetAttribute(EAttribute.Tick_AttackStealth) as number;

	public SetTickAttackStealth = (tick: number) => this.Model.SetAttribute(EAttribute.Tick_AttackStealth, tick);

	public TickAbility = (ability: EAbility) => (this.Model.GetAttribute(ability) as number) ?? 0;

	public SetTickAbility = (ability: EAbility, tick: number | undefined) => this.Model.SetAttribute(ability, tick);

	// Other

	public SelfStun(time: number, stunType: EStunType = EStunType.Default) {
		switch (stunType) {
			case EStunType.Default:
				this.SetStunnedFull(true);
				break;
			case EStunType.Partial:
				this.SetStunnedPartial(true);
				break;
		}

		SelfStun.FireServer(time, stunType);
	}

	// Destroy

	public Destroy() {
		this.AttributeChanged.Destroy();
	}
}
