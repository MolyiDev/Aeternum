import { EAbility } from "shared/Enums/Abilities/EAbility";

export interface IAbility {
	Start(): void;
	GetAbility(): EAbility;
}
