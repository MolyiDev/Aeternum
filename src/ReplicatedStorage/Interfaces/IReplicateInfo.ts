export interface IReplicateInfo {
	Receive?: boolean;
	Signal?: boolean;
	CanFeint?: boolean;
	HasFeintStop?: boolean;
	ReplicateStunned?: boolean;
	CanOverride?: boolean;
	Sound?: boolean;
	Cooldown: number;
	ReplicateClass?: string;
	AbilityClass?: string;
	StyleClass?: string;
}
