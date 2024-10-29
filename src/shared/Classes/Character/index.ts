import { Janitor } from "@rbxts/janitor";
import { IModel } from "shared/Interfaces/IModel";
import { IHumanoid } from "shared/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";

export class Character {
	public Model: IModel;
	public Humanoid: IHumanoid;
	public HumanoidRootPart: BasePart;
	public Janitor: Janitor;
	public Attributes: Attributes;
	public Animations: Animations;

	constructor(model: IModel) {
		this.Model = model;
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as BasePart;
		this.Janitor = new Janitor();
		this.Attributes = new Attributes(model);
		this.Animations = new Animations(this.Humanoid.WaitForChild("Animator") as Animator);
	}

	public Destroy() {
		this.Janitor.Destroy();
		this.Attributes.Destroy();
		this.Animations.Destroy();
	}
}
