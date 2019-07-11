// tslint:disable:completed-docs

import {
	Value
} from '../value';

import {
	ValueArray
} from './array';

describe('values/array', () => {
	describe('ValueArray', () => {
		describe('constructor', () => {
			it('length: 0', () => {
				const a: Value[] = [];
				const el = new ValueArray(a);
				expect(el.value).toBe(a);
			});

			it('length: 1', () => {
				const a: Value[] = [
					new ValueArray()
				];
				const el = new ValueArray(a);
				expect(el.value).toBe(a);
			});

			it('length: 2', () => {
				const a: Value[] = [
					new ValueArray(),
					new ValueArray()
				];
				const el = new ValueArray(a);
				expect(el.value).toBe(a);
			});
		});

		describe('toXml', () => {
			it('length: 0', () => {
				const el = new ValueArray([]);
				expect(el.toXml()).toBe('<array/>');
				expect(el.toXml(null, 1)).toBe('\t<array/>');
			});

			it('length: 1', () => {
				const el = new ValueArray([
					new ValueArray()
				]);
				expect(el.toXml()).toBe([
					'<array>',
					'\t<array/>',
					'</array>'
				].join('\n'));
				expect(el.toXml(null, 1)).toBe([
					'\t<array>',
					'\t\t<array/>',
					'\t</array>'
				].join('\n'));
			});

			it('length: 2', () => {
				const el = new ValueArray([
					new ValueArray(),
					new ValueArray()
				]);
				expect(el.toXml()).toBe([
					'<array>',
					'\t<array/>',
					'\t<array/>',
					'</array>'
				].join('\n'));
				expect(el.toXml(null, 1)).toBe([
					'\t<array>',
					'\t\t<array/>',
					'\t\t<array/>',
					'\t</array>'
				].join('\n'));
			});
		});

		describe('fromXml', () => {
			it('length: 0', () => {
				const el = new ValueArray([
					new ValueArray()
				]);
				el.fromXml('<array></array>');
				expect(el.value.length).toBe(0);
			});

			it('length: 1', () => {
				const el = new ValueArray();
				el.fromXml('<array><true/></array>');
				expect(el.value.length).toBe(1);
			});

			it('length: 2', () => {
				const el = new ValueArray();
				el.fromXml('<array><true/><true/></array>');
				expect(el.value.length).toBe(2);
			});

			it('text', () => {
				const el = new ValueArray();
				expect(() => {
					el.fromXml('<array>text</array>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueArray();
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
