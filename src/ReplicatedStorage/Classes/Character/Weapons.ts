import { Character } from ".";
import { EWeapon } from "ReplicatedStorage/Enums/EWeapons";

export class Weapons {
	private WeaponsFolder: Folder;

	private Weapons: Set<EWeapon | string>;

	public EquippedWeapon: EWeapon = EWeapon.Hands;

	constructor(character: Character) {
		const Model = character.Model;
		const Butler = character.Butler;

		this.WeaponsFolder = Model.WaitForChild("Weapons") as Folder;

		Butler.Connect(this.WeaponsFolder.ChildAdded, (weapon) => this.WeaponAdded(weapon));
		Butler.Connect(this.WeaponsFolder.ChildRemoved, (weapon) => this.WeaponRemoved(weapon));

		this.Weapons = new Set([EWeapon.Hands]);

		this.WeaponsFolder.GetDescendants().forEach((weapon) => this.WeaponAdded(weapon));
	}

	public Has = (weapon: string | EWeapon) => this.Weapons.has(weapon);

	public IsEquipped = (weapon: EWeapon | string) => this.EquippedWeapon === weapon;

	public WeaponAdded(weapon: Instance) {
		this.Weapons.add(weapon.Name);
	}

	public WeaponRemoved(weapon: Instance) {
		this.Weapons.delete(weapon.Name);
	}

	public Destroy() {
		this.WeaponsFolder = undefined!;
		this.Weapons.clear();
		this.Weapons = undefined!;
	}
}
