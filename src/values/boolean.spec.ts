/* eslint-env jasmine */
/* eslint-disable max-nested-callbacks */

import {
	ValueBoolean
} from './boolean';

describe('values/boolean', () => {
	describe('ValueBoolean', () => {
		describe('constructor', () => {
			it('false', () => {
				const el = new ValueBoolean(false);
				expect(el.value).toBe(false);
			});

			it('true', () => {
				const el = new ValueBoolean(true);
				expect(el.value).toBe(true);
			});
		});

		describe('toXml', () => {
			it('true', () => {
				const el = new ValueBoolean(true);
				expect(el.toXml()).toBe('<true/>');
				expect(el.toXml(null, 1)).toBe('\t<true/>');
			});

			it('false', () => {
				const el = new ValueBoolean(false);
				expect(el.toXml()).toBe('<false/>');
				expect(el.toXml(null, 1)).toBe('\t<false/>');
			});
		});

		describe('fromXml', () => {
			it('true', () => {
				const el = new ValueBoolean(false);
				el.fromXml('<true/>');
				expect(el.value).toBe(true);
				el.value = false;
				el.fromXml('<true></true>');
				expect(el.value).toBe(true);
			});

			it('false', () => {
				const el = new ValueBoolean(true);
				el.fromXml('<false/>');
				expect(el.value).toBe(false);
				el.value = true;
				el.fromXml('<false></false>');
				expect(el.value).toBe(false);
			});

			it('children', () => {
				const el = new ValueBoolean(false);
				expect(() => {
					el.fromXml('<true>a</true>');
				}).toThrow();
				expect(() => {
					el.fromXml('<true><a/></true>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueBoolean(false);
				expect(() => {
					el.fromXml('<bad/>');
				}).toThrow();
				expect(() => {
					el.fromXml('<bad></bad>');
				}).toThrow();
			});
		});
	});
});
