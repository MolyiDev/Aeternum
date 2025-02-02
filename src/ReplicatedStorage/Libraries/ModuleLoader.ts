/* eslint-disable @typescript-eslint/no-require-imports */
import { ReplicatedStorage } from "@rbxts/services";

export class ModuleLoader {
	public static Init() {
		const ReplicatesClient = ReplicatedStorage.WaitForChild("Classes").WaitForChild("Replicate").GetDescendants();

		ReplicatesClient.forEach((replicate) => {
			if (!replicate.IsA("ModuleScript") || replicate.Parent?.Name !== "SelfInit") return;
			require(replicate);
		});
	}
}
