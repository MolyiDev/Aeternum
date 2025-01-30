// Imports
import { Players, ReplicatedStorage } from "@rbxts/services";
import { CharacterManager } from "ReplicatedStorage/Managers/CharacterManager";

// Events
const Events = ReplicatedStorage.WaitForChild("Events").WaitForChild("Combat");
const KnockbackEvent = Events.WaitForChild("Knockback") as RemoteEvent;

// Variables
const Player = Players.LocalPlayer;
const Character = CharacterManager.WaitCharacter(Player.Character ?? Player.CharacterAdded.Wait()[0]);
const HumanoidRootPart = Character.HumanoidRootPart;

KnockbackEvent.OnClientEvent.Connect((velocity: Vector3) => HumanoidRootPart.ApplyImpulse(velocity));
