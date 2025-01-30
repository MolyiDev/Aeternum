export const EGlobal = {
	Feint: 0.65,
	PerfectBlockTime: 0.2,
	PerfectBlockDamageReduce: 0,
	PerfectBlockVelocityReduce: 0.2,
	BlockDamageReduce: 0.25,
	BlockVelocityReduce: 0.35,
	Gravity: 196.2,
} as const;

type EGlobal = (typeof EGlobal)[keyof typeof EGlobal];
