import { describe, expect, it } from 'vitest';
import { SeedHistory } from './SeedHistory.js';

describe('SeedHistory', () => {
	it('starts with the initial value and no previous value', () => {
		const history = new SeedHistory(0.5);
		expect(history.active).toBe(0.5);
		expect(history.hasPrevious).toBe(false);
	});

	it('steps back and forward through added values', () => {
		const history = new SeedHistory(1);
		history.add(2);
		history.add(3);
		expect(history.previous()).toBe(2);
		expect(history.previous()).toBe(1);
		expect(history.previous()).toBe(1);
		expect(history.next()).toBe(2);
		expect(history.next()).toBe(3);
	});

	it('generates a new random value when stepping past the end', () => {
		const history = new SeedHistory(1);
		const next = history.next();
		expect(next).not.toBe(1);
		expect(history.hasPrevious).toBe(true);
		expect(history.previous()).toBe(1);
	});
});
