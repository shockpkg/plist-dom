// tslint:disable:completed-docs

import {
	ValueInteger
} from './integer';

describe('values/integer', () => {
	describe('ValueInteger', () => {
		describe('constructor', () => {
			it('42', () => {
				const el = new ValueInteger(42);
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				expect(() => new ValueInteger(3.14)).toThrow();
			});
		});

		describe('toXml', () => {
			it('42', () => {
				const el = new ValueInteger(42);
				expect(el.toXml()).toBe('<integer>42</integer>');
				expect(el.toXml(null, 1)).toBe('\t<integer>42</integer>');
			});

			it('3.14', () => {
				const el = new ValueInteger();
				el.value = 3.14;
				expect(() => el.toXml()).toThrow();
			});
		});

		describe('fromXml', () => {
			it('42', () => {
				const el = new ValueInteger();
				el.fromXml('<integer>42</integer>');
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				const el = new ValueInteger();
				expect(() => {
					el.fromXml('<integer>3.14</integer>');
				}).toThrow();
			});

			it('empty', () => {
				const el = new ValueInteger();
				expect(() => {
					el.fromXml('<integer/>');
				}).toThrow();
				expect(() => {
					el.fromXml('<integer></integer>');
				}).toThrow();
			});

			it('datadata', () => {
				const el = new ValueInteger();
				expect(() => {
					el.fromXml('<real>baddata</real>');
				}).toThrow();
			});

			it('children', () => {
				const el = new ValueInteger();
				expect(() => {
					el.fromXml('<integer><a/></integer>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueInteger();
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
