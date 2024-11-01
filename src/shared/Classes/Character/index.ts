import { IModel } from "shared/Interfaces/IModel";
import { IHumanoid } from "shared/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";
import { Abilities } from "./Abilities";
import { Butler } from "shared/Modules/Butler";
import { ReplicateClient } from "./ReplicateClient";
import { RunService } from "@rbxts/services";

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

	constructor(model: IModel) {
		this.Model = model;
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as BasePart;
		this.Butler = new Butler();
		this.Attributes = new Attributes(model);
		this.Abilities = new Abilities(this);
		this.Animations = new Animations(this);
		if (RunService.IsClient()) this.ReplicateClient = new ReplicateClient(this);
		else this.ReplicateClient = undefined!;
	}

	public Destroy() {
		task.spawn(() => {
			this.Butler.Destroy();
			this.Attributes.Destroy();
			this.Abilities.Destroy();
			this.Animations.Destroy();
			if (RunService.IsClient()) {
				this.ReplicateClient.Destroy();
				this.ReplicateClient = undefined!;
			}

			this.Model = undefined!;
			this.Humanoid = undefined!;
			this.HumanoidRootPart = undefined!;
			this.Butler = undefined!;
			this.Attributes = undefined!;
			this.Abilities = undefined!;
			this.Animations = undefined!;
		});
	}
}
