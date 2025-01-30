// Imports
import { ServerStorage, Workspace } from "@rbxts/services";
import { Character } from "ReplicatedStorage/Classes/Character";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";

// Variables
const Weapons = ServerStorage.WaitForChild("Weapons").GetDescendants();
const WeaponsDictionary: { [key: string]: BasePart } = {};
Weapons.forEach((weapon) => {
	if (!weapon.IsA("BasePart")) return;
	WeaponsDictionary[weapon.Name] = weapon;
});

export class WeaponManager {
	public static RemoveWeapon(character: Character, weapon: EWeapon) {
		character.Model.Weapons.FindFirstChild(weapon)!.Destroy();
		character.HumanoidRootPart.FindFirstChild(weapon)!.Destroy();
	}

	public static AddWeapon(character: Character, weapon: EWeapon) {
		const WeaponModel = WeaponsDictionary[weapon].Clone();
		WeaponModel.Parent = character.Model.Weapons;
		const Handle = new Instance("Motor6D", character.HumanoidRootPart);
		Handle.Name = weapon;
		Handle.Part0 = character.HumanoidRootPart;
		Handle.Part1 = WeaponModel;
	}
}
