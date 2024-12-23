export enum EAnimations {
	// Idle
	IdleDefault = "IdleDefault",
	IdleVariant1 = "IdleVariant1",

	// Walk
	WalkForward = "WalkForward",
	WalkForwardLeft = "WalkForwardLeft",
	WalkForwardRight = "WalkForwardRight",
	WalkBack = "WalkBack",
	WalkBackLeft = "WalkBackLeft",
	WalkBackRight = "WalkBackRight",
	WalkLeft = "WalkLeft",
	WalkRight = "WalkRight",

	// Run
	Run = "Run",

	// Crouch
	CrouchIdle = "CrouchIdle",
	CrouchMove = "CrouchMove",

	// Jump
	RunJump = "RunJump",
	WalkJump = "WalkJump",
	DoubleJump = "DoubleJump",

	// Fall
	Fall = "Fall",

	// Land
	LandLarge = "LandLarge",
	LandShort = "LandShort",

	// Slide
	SlideIdle = "SlideIdle",
	SlideJump = "SlideJump",
	SlideStart = "SlideStart",

	// Climb
	ClimbIdle = "ClimbIdle",

	ClimbImpulseUp = "ClimbImpulseUp",
	ClimbImpulseDown = "ClimbImpulseDown",
	ClimbImpulseLeft = "ClimbImpulseLeft",
	ClimbImpulseRight = "ClimbImpulseRight",

	ClimbMoveUp = "ClimbMoveUp",
	ClimbMoveDown = "ClimbMoveDown",
	ClimbMoveLeft = "ClimbMoveLeft",
	ClimbMoveRight = "ClimbMoveRight",
	// Dash
	DashForward = "DashForward",
	DashBack = "DashBack",
	DashLeft = "DashLeft",
	DashRight = "DashRight",

	// Combat
	Default_Hands_Block = "Default_Hands_Block",
	Default_Hands_Guard = "Default_Hands_Guard",

	Default_Hands_BasicAttack0 = "Default_Hands_BasicAttack0",
	Default_Hands_BasicAttack1 = "Default_Hands_BasicAttack1",
	Default_Hands_BasicAttack2 = "Default_Hands_BasicAttack2",
	Default_Hands_BasicAttack3 = "Default_Hands_BasicAttack3",

	Default_Hands_RunAttack = "Default_Hands_RunAttack",
	Default_Hands_HeavyAttack = "Default_Hands_HeavyAttack",
	Default_Hands_CrouchAttack = "Default_Hands_CrouchAttack",
	Default_Hands_ReceiveCrouchAttack = "Default_Hands_ReceiveCrouchAttack",

	Default_Hands_AirAttack = "Default_Hands_AirAttack",

	// Abilities
	SeriousPunch = "SeriousPunch",
	ElectricKick = "ElectricKick",

	GroundSmashIdle = "GroundSmashIdle",
	GroundSmashLand = "GroundSmashLand",
	GroundSmash = "GroundSmash",

	ReceiveElectricKick = "ReceiveElectricKick",
}
