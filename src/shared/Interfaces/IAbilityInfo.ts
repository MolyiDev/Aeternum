export interface IAbilityInfo {
	Cooldown: number;
	Damage: number[];
	ParryStunTime: number;
	ParryTime: number; // Time that can parry
	Parryable: boolean;
	BlockDamageReduce: number; // Damage = Damage[0] / BlockDamageReduce
	Blockeable: boolean;
	Dasheable: boolean;
}
