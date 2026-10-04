/**
 * Tracks the sequence of values chosen for a random seed parameter so the user can step backwards and forwards
 * through the seeds they have visited.
 */
export class SeedHistory {
	private values: number[];
	private activeIndex: number;

	/**
	 * @param initialValue The first seed in the history, which starts as the active value.
	 */
	constructor(initialValue: number) {
		this.values = [initialValue];
		this.activeIndex = 0;
	}

	/**
	 * The currently active seed.
	 */
	get active(): number {
		return this.values[this.activeIndex];
	}

	/**
	 * `true` when there is an earlier seed that `previous` can step back to.
	 */
	get hasPrevious(): boolean {
		return this.activeIndex > 0;
	}

	/**
	 * Steps back to the earlier seed. Does nothing when already at the start of the history.
	 *
	 * @returns The active seed after stepping.
	 */
	previous(): number {
		if (this.hasPrevious) {
			this.activeIndex -= 1;
		}
		return this.active;
	}

	/**
	 * Steps forward to the next seed already in the history, or generates a new random seed when at the end.
	 *
	 * @returns The active seed after stepping.
	 */
	next(): number {
		if (this.activeIndex < this.values.length - 1) {
			this.activeIndex += 1;
			return this.active;
		}
		return this.random();
	}

	/**
	 * Adds a new random seed to the end of the history and makes it active.
	 *
	 * @returns The new active seed.
	 */
	random(): number {
		return this.add(Math.random());
	}

	/**
	 * Adds a specific seed to the end of the history and makes it active. Used when the user types a seed.
	 *
	 * @param value The seed to add.
	 * @returns The new active seed.
	 */
	add(value: number): number {
		this.values.push(value);
		this.activeIndex = this.values.length - 1;
		return this.active;
	}
}
