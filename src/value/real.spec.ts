import {
	ValueReal
} from './real';

describe('value/real', () => {
	describe('ValueReal', () => {
		describe('constructor', () => {
			it('42', () => {
				const el = new ValueReal(42);
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				const el = new ValueReal(3.14);
				expect(el.value).toBe(3.14);
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
				expect(el.toXml()).toBe('<real>3.14</real>');
			});
		});

		describe('fromXml', () => {
			it('42', () => {
				const el = new ValueReal();
				el.fromXml('<real>42</real>');
				expect(el.value).toBe(42);
			});

			it('42.0', () => {
				const el = new ValueReal();
				el.fromXml('<real>42.0</real>');
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>3.14</real>');
				expect(el.value).toBe(3.14);
			});

			it('.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>3.14</real>');
				expect(el.value).toBe(3.14);
			});

			it('0.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>0.14</real>');
				expect(el.value).toBe(0.14);
			});

			it('-.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>-.14</real>');
				expect(el.value).toBe(-0.14);
			});

			it('+.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>+.14</real>');
				expect(el.value).toBe(0.14);
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

			it('baddata', () => {
				const el = new ValueReal();
				expect(() => {
					el.fromXml('<real>baddata</real>');
				}).toThrow();
				expect(() => {
					el.fromXml('<real>1.</real>');
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
