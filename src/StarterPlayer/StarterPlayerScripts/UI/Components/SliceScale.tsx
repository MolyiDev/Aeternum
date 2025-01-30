import { useEffect, useState } from "@rbxts/react";
import { Workspace } from "@rbxts/services";

export function useScale(BaseScale: number, BaseWidth = 1920, BaseHeight = 1080) {
	const [sliceScale, SetSliceSize] = useState<number>(BaseScale);

	useEffect(() => {
		let connection: RBXScriptConnection | undefined;

		const UpdateSliceSize = () => {
			const camera = Workspace.CurrentCamera;
			if (camera) {
				const viewportSize = camera.ViewportSize;
				const widthScale = viewportSize.X / BaseWidth;
				const heightScale = viewportSize.Y / BaseHeight;
				const scale = math.min(widthScale, heightScale);
				SetSliceSize(BaseScale * scale);
			}
		};

		const ConnectCamera = () => {
			const camera = Workspace.CurrentCamera;
			if (camera) {
				connection?.Disconnect();
				connection = camera.GetPropertyChangedSignal("ViewportSize").Connect(UpdateSliceSize);
				UpdateSliceSize();
			}
		};

		ConnectCamera();

		const cameraConnection = Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => ConnectCamera());

		return () => {
			connection?.Disconnect();
			cameraConnection.Disconnect();
		};
	}, [BaseScale, BaseWidth, BaseHeight]);

	return sliceScale;
}
