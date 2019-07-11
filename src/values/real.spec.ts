// tslint:disable:completed-docs

import {
	ValueReal
} from './real';

describe('values/real', () => {
	describe('ValueReal', () => {
		describe('constructor', () => {
			it('42', () => {
				const el = new ValueReal(42);
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				expect(() => new ValueReal(3.14)).toThrow();
			});
		});

		describe('toXml', () => {
			it('42', () => {
				const el = new ValueReal(42);
				expect(el.toXml()).toBe('<real>42</real>');
				expect(el.toXml(null, 1)).toBe('\t<real>42</real>');
			});

			it('3.14', () => {
				const el = new ValueReal();
				el.value = 3.14;
				expect(() => el.toXml()).toThrow();
			});
		});

		describe('fromXml', () => {
			it('42', () => {
				const el = new ValueReal();
				el.fromXml('<real>42</real>');
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				const el = new ValueReal();
				expect(() => {
					el.fromXml('<real>3.14</real>');
				}).toThrow();
			});

			it('empty', () => {
				const el = new ValueReal();
				expect(() => {
					el.fromXml('<real/>');
				}).toThrow();
				expect(() => {
					el.fromXml('<real></real>');
				}).toThrow();
			});

			it('datadata', () => {
				const el = new ValueReal();
				expect(() => {
					el.fromXml('<real>baddata</real>');
				}).toThrow();
			});

			it('children', () => {
				const el = new ValueReal();
				expect(() => {
					el.fromXml('<real><a/></real>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueReal();
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
