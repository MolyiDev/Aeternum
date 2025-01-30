/* eslint-disable @typescript-eslint/no-require-imports */
import Signal from "@rbxts/lemon-signal";
import { EParameter } from "ReplicatedStorage/Enums/EParameter";
import { IHumanoid } from "ReplicatedStorage/Interfaces/IHumanoid";
import { RunService } from "@rbxts/services";
import { Character } from ".";

export class Parameters {
	public Humanoid: IHumanoid;
	public Dead: boolean = false;
	public Parameters: Folder;
	public ParameterChanged: Signal<[string, number]> = new Signal();

	constructor(character: Character) {
		this.Humanoid = character.Humanoid;
		this.Parameters = character.Model.WaitForChild("Parameters") as Folder;

		this.Humanoid.Health = this.Get(EParameter.Health);
		this.Humanoid.MaxHealth = this.GetMax(EParameter.Health);

		if (RunService.IsClient()) {
			character.Butler.Connect(this.Parameters.AttributeChanged, (attribute: string) =>
				this.ParameterChanged.Fire(attribute, this.Get(attribute)),
			);
		}
	}

	public Destroy() {
		this.ParameterChanged.Destroy();

		this.Humanoid = undefined!;
		this.ParameterChanged = undefined!;
		this.ParameterChanged = undefined!;
	}

	public UpdateValue(parameter: string, value: number) {
		switch (parameter) {
			case EParameter.Health:
				if (value === 0) this.Dead = true;

				break;
		}
	}

	public Modify(parameter: string, value: number, fireEvent: boolean = true) {
		const oldValue = this.Get(parameter);
		const newValue = math.clamp(oldValue + value, 0, this.GetMax(parameter));
		if (oldValue === newValue) return;
		this.Parameters.SetAttribute(parameter, newValue);
		if (fireEvent) this.ParameterChanged.Fire(parameter, newValue);
		this.UpdateValue(parameter, newValue);
	}

	public Set(parameter: string, value: number, fireEvent: boolean = true) {
		const oldValue = this.Get(parameter);
		const newValue = math.clamp(value, 0, this.GetMax(parameter));
		if (oldValue === newValue) return;
		this.Parameters.SetAttribute(parameter, newValue);
		if (fireEvent) this.ParameterChanged.Fire(parameter, newValue);
		this.UpdateValue(parameter, newValue);
	}

	public Get = (parameter: string) => tonumber(this.Parameters.GetAttribute(parameter)) as number;
	public GetMax = (parameter: string) => (tonumber(this.Parameters.GetAttribute(`Max${parameter}`)) as number) ?? 100;
}
