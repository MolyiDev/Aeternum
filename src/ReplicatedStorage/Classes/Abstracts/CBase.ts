import { Character } from "ReplicatedStorage/Classes/Character";

export abstract class CBase {
	protected Character: Character;

	protected get Model() {
		return this.Character.Model;
	}

	protected get Humanoid() {
		return this.Character.Humanoid;
	}

	protected get HumanoidRootPart() {
		return this.Character.HumanoidRootPart;
	}

	protected get Attributes() {
		return this.Character.Attributes;
	}

	protected get Abilities() {
		return this.Character.Abilities;
	}

	protected get Animations() {
		return this.Character.Animations;
	}

	protected get Butler() {
		return this.Character.Butler;
	}

	protected get Controls() {
		return this.Character.Controls;
	}

	protected get ShiftLock() {
		return this.Character.ShiftLock;
	}

	protected get States() {
		return this.Character.States;
	}

	protected get Styles() {
		return this.Character.Styles;
	}

	protected get Tweens() {
		return this.Character.Tweens;
	}

	protected get Weapons() {
		return this.Character.Weapons;
	}

	protected get OverlapParamsDefault() {
		return this.Character.OverlapParamsDefault;
	}

	protected get RayParamsDefault() {
		return this.Character.RayParamsDefault;
	}

	constructor(character: Character) {
		this.Character = character;
	}

	public Destroy() {
		this.Character = undefined!;
	}
}
