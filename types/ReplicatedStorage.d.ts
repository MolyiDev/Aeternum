interface ReplicatedStorage extends Instance {
	Events: Folder & {
		LocalInputBegan: BindableEvent;
		LocalInputEnded: BindableEvent;
		InputBegan: RemoteEvent;
		SettingsSet: RemoteEvent;
		InputEnded: RemoteEvent;
	};
	Enums: Folder & {
		EShip: ModuleScript;
		ESettingsControls: ModuleScript;
		ERarity: ModuleScript;
		ECustomInputs: ModuleScript;
		ESettingsGeneral: ModuleScript;
		EControlType: ModuleScript;
		ESettingsVisual: ModuleScript;
		ESettingsAudio: ModuleScript;
		EUI: ModuleScript;
	};
	Interfaces: Folder & {
		IPlayerSavedData: ModuleScript;
	};
	Animations: Folder & {
		Crouch: Folder & {
			CrouchStart: Animation;
			CrouchIdle: Animation;
			CrouchMovement: Animation;
		};
	};
	Managers: Folder & {
		SettingsManager: ModuleScript;
		MusicManager: ModuleScript;
		ToolsManager: ModuleScript;
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@rbxts"]: Folder & {
				services: ModuleScript;
				["compiler-types"]: Folder & {
					types: Folder;
				};
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
			};
		};
	};
}
