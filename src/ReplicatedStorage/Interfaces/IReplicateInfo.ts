export interface IReplicateInfo {
	SelfInit?: boolean; // If the Module will initialize itself without needing to be loaded before hand
	Signal?: boolean; // If the Module will start by sending a signal to the server
	CanFeint?: boolean; // If it can be feinted (First time, only stops when it's going to do damage)
	HasFeintStop?: boolean; // If it can be feinted (Second time, the animation stopts suddenly)
	ReplicateStunned?: boolean; // If the module can be replicated while the character is stunned
	CanOverride?: boolean; // If the animation can be on top or on bottom of another one (when using ability or style)
	Sound?: boolean; // If it has Sounds events on the animation
	Cooldown: number; // The cooldown it has
	ReplicateClass?: string; // Replicate Class Name
	AbilityClass?: string; // Ability Class Name
	StyleClass?: string; // Style Class Name
}
