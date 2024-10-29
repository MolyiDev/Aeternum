export interface ITweenManager {
	Pause(): void;
	Resume(): void;

	SetSpeed(speed: number, time: number): void;
	SetJump(jump: number, time: number): void;
}
