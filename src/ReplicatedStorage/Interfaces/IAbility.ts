import { EAbility } from "ReplicatedStorage/Enums/Abilities/EAbility";

export interface IAbility {
	Start(): void;
	GetAbility(): EAbility;
}
