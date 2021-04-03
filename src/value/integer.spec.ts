import {
	ValueInteger
} from './integer';

const small = '9007199254740991';
const smallPos = `+${small}`;
const smallNeg = `-${small}`;

const big = '9007199254740992';
const bigPos = `+${big}`;
const bigNeg = `-${big}`;
const supportsBigInt = typeof BigInt !== 'undefined';

describe('value/integer', () => {
	describe('ValueInteger', () => {
		describe('constructor', () => {
			it('42', () => {
				const el = new ValueInteger(42);
				expect(el.value).toBe(42);
			});

			it('3.14', () => {
				expect(() => new ValueInteger(3.14)).toThrow();
			});

			it(small, () => {
				const el = new ValueInteger(+small);
				expect(el.value).toBe(+small);
			});

			it(smallPos, () => {
				const el = new ValueInteger(+smallPos);
				expect(el.value).toBe(+smallPos);
			});

			it(smallNeg, () => {
				const el = new ValueInteger(+smallNeg);
				expect(el.value).toBe(+smallNeg);
			});

			if (!supportsBigInt) {
				return;
			}

			it(big, () => {
				const el = new ValueInteger(BigInt(big));
				expect(el.value).toBe(BigInt(big));
			});

			it(bigPos, () => {
				const el = new ValueInteger(BigInt(bigPos));
				expect(el.value).toBe(BigInt(bigPos));
			});

			it(bigNeg, () => {
				const el = new ValueInteger(BigInt(bigNeg));
				expect(el.value).toBe(BigInt(bigNeg));
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

			it(small, () => {
				const el = new ValueInteger(+small);
				expect(el.toXml()).toBe(`<integer>${small}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${small}</integer>`
				);
			});

			it(smallPos, () => {
				const el = new ValueInteger(+smallPos);
				expect(el.toXml()).toBe(`<integer>${small}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${small}</integer>`
				);
			});

			it(smallNeg, () => {
				const el = new ValueInteger(+smallNeg);
				expect(el.toXml()).toBe(`<integer>${smallNeg}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${smallNeg}</integer>`
				);
			});

			if (!supportsBigInt) {
				return;
			}

			it(big, () => {
				const el = new ValueInteger(BigInt(big));
				expect(el.toXml()).toBe(`<integer>${big}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${big}</integer>`
				);
			});

			it(bigPos, () => {
				const el = new ValueInteger(BigInt(bigPos));
				expect(el.toXml()).toBe(`<integer>${big}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${big}</integer>`
				);
			});

			it(bigNeg, () => {
				const el = new ValueInteger(BigInt(bigNeg));
				expect(el.toXml()).toBe(`<integer>${bigNeg}</integer>`);
				expect(el.toXml(null, 1)).toBe(
					`\t<integer>${bigNeg}</integer>`
				);
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

			it('baddata', () => {
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

			if (!supportsBigInt) {
				return;
			}

			it(big, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${big}</integer>`);
				expect(el.value).toBe(BigInt(big));
			});

			it(bigPos, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${bigPos}</integer>`);
				expect(el.value).toBe(BigInt(bigPos));
			});

			it(bigNeg, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${bigNeg}</integer>`);
				expect(el.value).toBe(BigInt(bigNeg));
			});
		});
	});
});
