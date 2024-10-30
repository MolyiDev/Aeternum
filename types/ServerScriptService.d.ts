interface ServerScriptService extends Instance {
	["Ground Smash Attack by HowToRoblox"]: Model & {
		["Put in StarterPack and Ungroup (Ctrl + U)"]: Model & {
			["Ground Smash"]: Tool & {
				GroundSmashHandler: Script & {
					AttackAnimation: Animation;
				};
			};
		};
		["Put in ReplicatedStorage and Ungroup (Ctrl + U)"]: Model & {
			Events: Folder & {
				CreateGroundSmashEffects: RemoteEvent;
				DealKnockback: RemoteEvent;
				ShakeCamera: RemoteEvent;
			};
			Effects: Folder & {
				GroundSmashAttack: Folder & {
					Sounds: Folder & {
						Attack: Sound;
					};
					Parts: Folder & {
						Attack: Part & {
							Particles: Attachment & {
								Core: ParticleEmitter;
								Smoke: ParticleEmitter;
								Sparks: ParticleEmitter;
							};
						};
					};
				};
			};
		};
		["Put in StarterCharacterScripts and Ungroup (Ctrl + U)"]: Model & {
			CameraShakeVisuals: LocalScript & {
				CameraShake: ModuleScript;
			};
			KnockbackVisuals: LocalScript;
			GroundSmashVisuals: LocalScript;
		};
	};
	Interfaces: Folder;
	NPC: Folder & {
		Scripts: Folder & {
			Interfaces: Folder & {
				ICombatManager: ModuleScript;
				ITweenManager: ModuleScript;
				IManager: ModuleScript;
			};
			Combat: Folder & {
				BlockModule: ModuleScript;
				CombatModule: ModuleScript;
				GuardModule: ModuleScript;
			};
			Main: Script;
			Managers: Folder & {
				IdleModule: ModuleScript;
				TweenModule: ModuleScript;
			};
		};
	};
	Start: Script;
	Handlers: Folder & {
		CombatHandler: Script;
		DashHandler: Script;
		StealthAttack: Script;
		BlockHandler: Script;
		HeadHandler: Script;
	};
	Moderation: Folder & {
		EventJoker: Script;
		Interfaces: Folder & {
			BanInfo: Script;
		};
		Moderation: ModuleScript;
	};
	Managers: Folder & {
		StunManager: ModuleScript;
		NPCManager: ModuleScript;
		DamageManager: ModuleScript;
		RagdollManager: ModuleScript;
		AnimManager: ModuleScript;
		HaloManager: ModuleScript;
	};
}
