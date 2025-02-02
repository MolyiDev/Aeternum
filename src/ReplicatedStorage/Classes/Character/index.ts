/* eslint-disable @typescript-eslint/no-require-imports */
import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";
import { Abilities } from "./Abilities";
import { Butler } from "ReplicatedStorage/Libraries/Butler";
import { ReplicateClient } from "./ReplicateClient";
import { Players, RunService, ServerScriptService } from "@rbxts/services";
import { Tweens } from "./Tweens";
import { Weapons } from "./Weapons";
import { Styles } from "./Styles";
import { States } from "./States";
import { IReplicateServer } from "ReplicatedStorage/Interfaces/IReplicateServer";
import { Parameters } from "./Parameters";
import { Controls } from "./Controls";
import { ShiftLock } from "./ShiftLock";
import { IHumanoidRootPart } from "ReplicatedStorage/Interfaces/IHumanoidRootPart";
const ReplicateServer = RunService.IsServer()
	? (
			require(ServerScriptService.WaitForChild("Classes").WaitForChild("ReplicateServer") as ModuleScript) as {
				[key: string]: new (character: Character) => IReplicateServer;
			}
		)["ReplicateServer"]
	: undefined;

export class Character {
	public Player: Player | undefined;
	public CharacterId: string;
	public Model: IModel;
	public Humanoid: IHumanoid;
	public HumanoidRootPart: IHumanoidRootPart;
	public Attributes: Attributes;
	public Abilities: Abilities;
	public Animations: Animations;
	public Butler: Butler;
	public Controls: Controls;
	public ShiftLock: ShiftLock;
	public Styles: Styles;
	public Weapons: Weapons;
	public States: States;
	public Tweens: Tweens;
	public Parameters: Parameters;
	public ReplicateClient: ReplicateClient;
	public ReplicateServer: IReplicateServer;

	public IsDestroyed: boolean = false;

	public OverlapParamsDefault: OverlapParams = new OverlapParams();
	public RayParamsDefault: RaycastParams = new RaycastParams();

	constructor(model: IModel, characterId: string) {
		this.CharacterId = characterId;
		this.Model = model;
		this.Player = Players.GetPlayerFromCharacter(model);
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as IHumanoidRootPart;
		this.Attributes = new Attributes(model);
		this.Animations = new Animations(this);
		this.Butler = new Butler();
		this.Weapons = new Weapons(this);
		this.States = new States(this);
		this.Tweens = new Tweens(this);
		this.Parameters = new Parameters(this);

		if (RunService.IsClient() && this.Player && this.Player === Players.LocalPlayer) {
			this.Controls = new Controls(this);
			this.ShiftLock = new ShiftLock(this);
		} else {
			this.Controls = undefined!;
			this.ShiftLock = undefined!;
		}

		this.Abilities = new Abilities(this);
		this.Styles = new Styles(this);

		if (RunService.IsClient()) {
			this.ReplicateClient = new ReplicateClient(this);
			this.ReplicateServer = undefined!;
		} else {
			this.ReplicateServer = new ReplicateServer!(this);
			this.ReplicateClient = undefined!;
		}

		this.OverlapParamsDefault.AddToFilter(model);
		this.OverlapParamsDefault.FilterType = Enum.RaycastFilterType.Exclude;

		this.RayParamsDefault.AddToFilter(model);
		this.RayParamsDefault.FilterType = Enum.RaycastFilterType.Exclude;
	}

	public Destroy() {
		this.IsDestroyed = true;

		task.spawn(() => {
			if (this.Player) {
				this.Tweens.Destroy();
				this.Tweens = undefined!;
				this.Player = undefined!;
			}

			if (RunService.IsClient()) {
				if (this.Player && this.Player === Players.LocalPlayer) {
					this.Controls.Destroy();
					this.ShiftLock.Destroy();
					this.Controls = undefined!;
					this.ShiftLock = undefined!;
				}
				this.ReplicateClient.Destroy();
				this.ReplicateClient = undefined!;
			} else {
				this.ReplicateServer.Destroy();
				this.ReplicateServer = undefined!;
			}

			this.Attributes.Destroy();
			this.Abilities.Destroy();
			this.Animations.Destroy();
			this.Styles.Destroy();
			this.Weapons.Destroy();
			this.States.Destroy();

			this.Model = undefined!;
			this.Humanoid = undefined!;
			this.HumanoidRootPart = undefined!;

			this.Attributes = undefined!;
			this.Abilities = undefined!;
			this.Animations = undefined!;
			this.Styles = undefined!;
			this.Weapons = undefined!;
			this.States = undefined!;

			task.wait(1);
			this.Butler.Destroy();
			this.Butler = undefined!;
		});
	}
}
