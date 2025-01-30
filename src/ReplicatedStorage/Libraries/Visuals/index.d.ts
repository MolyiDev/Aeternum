interface CastVisualizer {
	SphereCast(Origin: Vector3, Radius: number, Direction: Vector3, RaycastParameters?: RaycastParams): void;
	Blockcast(CF: CFrame, Size: Vector3, Direction: Vector3, RaycastParameters?: RaycastParams): void;
	Raycast(Origin: Vector3, Direction: Vector3, RaycastParameters?: RaycastParams): void;
	Hide(): void;
	Destroy(): void;
}

declare const Visuals: new (color?: Color3, worldRoot?: WorldRoot) => CastVisualizer;

export = Visuals;
