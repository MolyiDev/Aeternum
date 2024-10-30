import { IModel } from "shared/Interfaces/IModel";
import { IHumanoid } from "shared/Interfaces/IHumanoid";
import { Attributes } from "./Attributes";
import { Animations } from "./Animations";
import { Abilities } from "./Abilities";
import { Butler } from "shared/Modules/Butler";

export class Character {
	public Model: IModel;
	public Humanoid: IHumanoid;
	public HumanoidRootPart: BasePart;
	public Butler: Butler;
	public Attributes: Attributes;
	public Abilities: Abilities;
	public Animations: Animations;

	constructor(model: IModel) {
		this.Model = model;
		this.Humanoid = model.WaitForChild("Humanoid") as IHumanoid;
		this.HumanoidRootPart = model.WaitForChild("HumanoidRootPart") as BasePart;
		this.Butler = new Butler();
		this.Attributes = new Attributes(model);
		this.Abilities = new Abilities();
		this.Animations = new Animations(this);
	}

	public Destroy() {
		this.Butler.Destroy();
		this.Attributes.Destroy();
		this.Animations.Destroy();
	}
}
