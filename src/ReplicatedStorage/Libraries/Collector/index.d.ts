interface Collector {
	/**
	 * Add an item to the collector
	 */
	AddItem(Object: Instance, Lifetime: number): void;

	/**
	 *
	 */
	MaxItems(number: number): void;
}

declare const Collector: Collector;

export = Collector;
