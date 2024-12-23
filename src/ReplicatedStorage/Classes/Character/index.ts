import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";
import { Abilities } from "./Abilities";
import { Butler } from "ReplicatedStorage/Modules/Butler";
import { ReplicateClient } from "./ReplicateClient";
import { RunService } from "@rbxts/services";
import { ReplicateServer } from "./ReplicateServer";
import { Tweens } from "./Tweens";
import { Weapons } from "./Weapons";
import { Moves } from "./Moves";
import { States } from "./States";

export class Character {
	public Player: Player;
	public Model: IModel;
	public Humanoid: IHumanoid;
	public HumanoidRootPart: BasePart;
	public Butler: Butler;
	public Attributes: Attributes;
	public Abilities: Abilities;
	public Animations: Animations;
	public Moves: Moves;
	public Weapons: Weapons;
	public Tweens: Tweens;
	public States: States;
	public ReplicateClient: ReplicateClient;
	public ReplicateServer: ReplicateServer;

	constructor(model: IModel, player: Player = undefined!) {
		this.Model = model;
		this.Player = player;
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as BasePart;
		this.Butler = new Butler();
		this.Attributes = new Attributes(model);
		this.Abilities = new Abilities(this);
		this.Animations = new Animations(this);
		this.Moves = new Moves(this);
		this.Weapons = new Weapons(this);
		this.States = new States(this);
		if (player) this.Tweens = new Tweens(this);
		else this.Tweens = undefined!;

		if (RunService.IsClient()) {
			this.ReplicateClient = new ReplicateClient(this);
			this.ReplicateServer = undefined!;
		} else {
			this.ReplicateClient = undefined!;
			this.ReplicateServer = new ReplicateServer(this);
		}
	}

	public Destroy() {
		task.spawn(() => {
			if (this.Player) {
				this.Tweens.Destroy();
				this.Tweens = undefined!;
				this.Player = undefined!;
			}

			if (RunService.IsClient()) {
				this.ReplicateClient.Destroy();
				this.ReplicateClient = undefined!;
			} else {
				this.ReplicateServer.Destroy();
				this.ReplicateServer = undefined!;
			}

			this.Attributes.Destroy();
			this.Abilities.Destroy();
			this.Animations.Destroy();
			this.Moves.Destroy();
			this.Weapons.Destroy();
			this.States.Destroy();

			this.Model = undefined!;
			this.Humanoid = undefined!;
			this.HumanoidRootPart = undefined!;

			this.Attributes = undefined!;
			this.Abilities = undefined!;
			this.Animations = undefined!;
			this.Moves = undefined!;
			this.Weapons = undefined!;
			this.States = undefined!;

			task.wait(1);
			this.Butler.Destroy();
			this.Butler = undefined!;
		});
	}
}
