import { IModel } from "ReplicatedStorage/Interfaces/IModel";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";
import { Abilities } from "./Abilities";
import { Butler } from "ReplicatedStorage/Modules/Butler";
import { ReplicateClient } from "./ReplicateClient";
import { RunService } from "@rbxts/services";
import { ReplicateServer } from "./ReplicateServer";

export class Character {
	public IsPlayer: boolean = false;
	public Model: IModel;
	public Humanoid: IHumanoid;
	public HumanoidRootPart: BasePart;
	public Butler: Butler;
	public Attributes: Attributes;
	public Abilities: Abilities;
	public Animations: Animations;
	public ReplicateClient: ReplicateClient;
	public ReplicateServer: ReplicateServer;

	constructor(model: IModel) {
		this.Model = model;
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as BasePart;
		this.Butler = new Butler();
		this.Attributes = new Attributes(model);
		this.Abilities = new Abilities(this);
		this.Animations = new Animations(this);
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

			this.Attributes = undefined!;
			this.Abilities = undefined!;
			this.Animations = undefined!;
			this.Model = undefined!;
			this.Humanoid = undefined!;
			this.HumanoidRootPart = undefined!;

			task.wait(1);
			this.Butler.Destroy();
			this.Butler = undefined!;
		});
	}
}
