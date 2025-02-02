/* eslint-disable roblox-ts/lua-truthiness */
// Imports
import { Connection } from "@rbxts/lemon-signal";
import { RunService } from "@rbxts/services";

// Interfaces
interface SignalLike<T extends Callback> {
	Connect(callback: T): RBXScriptConnection | Connection;
	Once(callback: T): RBXScriptConnection | Connection;
}

type AnyPlus = string | number | true | symbol | ((this: never) => void) | ((_: never) => void);

export class Butler<U extends object | void = void> {
	public CurrentlyCleaning: boolean = false;
	private Objects: Map<object, AnyPlus> = new Map();

	public Add<
		O extends keyof U extends never
			? object
			: M extends true
				? Callback | thread
				: M extends never
					? RBXScriptConnection | { Destroy(): void }
					: object,
		M extends never | ((this: O) => void) | ((_: O) => void) | ExtractKeys<O, () => void> | true,
	>(object: O, cleanMethod: M): O {
		this.CheckCleaning("Add");

		this.Objects.set(object, cleanMethod);
		return object;
	}

	public Connect<T extends Callback>(signal: SignalLike<T>, callback: T) {
		this.CheckCleaning("Connect");

		return this.Add(signal.Connect(callback), "Disconnect");
	}

	public ConnectParallel<T extends Callback>(signal: RBXScriptSignal<T>, callback: T) {
		this.CheckCleaning("ConnectParallel");

		return this.Add(signal.ConnectParallel(callback), "Disconnect");
	}

	public Once<T extends Callback>(signal: SignalLike<T>, callback: T) {
		this.CheckCleaning("Connect");

		// eslint-disable-next-line prefer-const
		let Connection: RBXScriptConnection;

		const ExtendedCallback = ((...args: Parameters<T>) => {
			this.Remove(Connection);
			callback(args);
		}) as T;

		Connection = this.Add(signal.Once(ExtendedCallback), "Disconnect");
		return Connection;
	}

	public BindToRenderStep(name: string, priority: number, callback: (deltaTime: number) => void) {
		this.CheckCleaning("BindToRenderStep");

		RunService.BindToRenderStep(name, priority, callback);

		this.Add(() => RunService.UnbindFromRenderStep(name), true);
	}

	public Extend(): Butler {
		this.CheckCleaning("Extend");

		return this.Add(new Butler(), "Destroy");
	}

	public Remove(object: object | undefined): Butler {
		this.CheckCleaning("Remove");

		this._Remove(object);

		return this;
	}

	public RemoveNoClean(object: object | undefined): Butler {
		this.CheckCleaning("RemoveNoClean");

		this._RemoveNoClean(object);

		return this;
	}

	public RemoveList<T extends defined | undefined>(...objects: Array<T>): Butler {
		this.CheckCleaning("RemoveList");
		if (!objects) return this;

		for (const obj of objects) this._Remove(obj);

		return this;
	}

	public RemoveListNoClean<T extends defined | undefined>(...objects: Array<T>): Butler {
		this.CheckCleaning("RemoveListNoClean");

		for (const obj of objects) this._RemoveNoClean(obj);

		return this;
	}

	public Clean() {
		this.CheckCleaning("Clean");

		this.CurrentlyCleaning = true;

		task.spawn(() => {
			this.Objects.forEach((cleanMethod, object) => {
				this.CleanObject(object, cleanMethod);
				this.Objects.delete(object);
			});
			this.CurrentlyCleaning = false;
		});
	}

	public Destroy = () => this.Clean();

	public AttachtToInstance(instance: Instance) {
		this.CheckCleaning("AttachtToInstance");

		return this.Connect(instance.Destroying, () => this.Destroy);
	}

	private _Remove(object: object | undefined) {
		if (!object) return;
		const CleanMethod = this.Objects.get(object);

		if (CleanMethod) this.CleanObject(object, CleanMethod);
		this.Objects.delete(object);
	}

	private _RemoveNoClean = (object: object | undefined) => {
		if (!object) return;
		this.Objects.delete(object);
	};

	private CleanObject<T>(object: T, cleanMethod: AnyPlus): void {
		if (typeIs(cleanMethod, "boolean")) {
			if (typeIs(object, "function")) object();
			else {
				let wasCancelled: boolean | undefined = undefined;
				const toCleanup = object as unknown as thread;

				if (coroutine.running() !== toCleanup) wasCancelled = pcall(() => task.cancel(toCleanup))[0];
				if (!wasCancelled) task.defer(() => task.cancel(toCleanup));
			}
		} else (object as { [key: string]: Callback })[cleanMethod as string](object);
	}

	private CheckCleaning(method: string) {
		if (this.CurrentlyCleaning) error(`Cannot call method '${method}' while cleaning`, 2);
	}
}
