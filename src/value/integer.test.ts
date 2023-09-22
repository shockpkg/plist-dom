/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {ValueInteger} from './integer';

const small = '9007199254740991';
const smallPos = `+${small}`;
const smallNeg = `-${small}`;

const big = '9007199254740992';
const bigPos = `+${big}`;
const bigNeg = `-${big}`;
const supportsBigInt = typeof BigInt !== 'undefined';

void describe('value/integer', () => {
	void describe('ValueInteger', () => {
		void describe('constructor', () => {
			void it('42', () => {
				const el = new ValueInteger(42);
				strictEqual(el.value, 42);
			});

			void it('3.14', () => {
				throws(() => new ValueInteger(3.14));
			});

			void it(small, () => {
				const el = new ValueInteger(+small);
				strictEqual(el.value, +small);
			});

			void it(smallPos, () => {
				const el = new ValueInteger(+smallPos);
				strictEqual(el.value, +smallPos);
			});

			void it(smallNeg, () => {
				const el = new ValueInteger(+smallNeg);
				strictEqual(el.value, +smallNeg);
			});

			if (!supportsBigInt) {
				return;
			}

			void it(big, () => {
				const el = new ValueInteger(BigInt(big));
				strictEqual(el.value, BigInt(big));
			});

			void it(bigPos, () => {
				const el = new ValueInteger(BigInt(bigPos));
				strictEqual(el.value, BigInt(bigPos));
			});

			void it(bigNeg, () => {
				const el = new ValueInteger(BigInt(bigNeg));
				strictEqual(el.value, BigInt(bigNeg));
			});
		});

		void describe('toXml', () => {
			void it('42', () => {
				const el = new ValueInteger(42);
				strictEqual(el.toXml(), '<integer>42</integer>');
				strictEqual(el.toXml(null, 1), '\t<integer>42</integer>');
			});

			void it('3.14', () => {
				const el = new ValueInteger();
				el.value = 3.14;
				throws(() => el.toXml());
			});

			void it(small, () => {
				const el = new ValueInteger(+small);
				strictEqual(el.toXml(), `<integer>${small}</integer>`);
				strictEqual(el.toXml(null, 1), `\t<integer>${small}</integer>`);
			});

			void it(smallPos, () => {
				const el = new ValueInteger(+smallPos);
				strictEqual(el.toXml(), `<integer>${small}</integer>`);
				strictEqual(el.toXml(null, 1), `\t<integer>${small}</integer>`);
			});

			void it(smallNeg, () => {
				const el = new ValueInteger(+smallNeg);
				strictEqual(el.toXml(), `<integer>${smallNeg}</integer>`);
				strictEqual(
					el.toXml(null, 1),
					`\t<integer>${smallNeg}</integer>`
				);
			});

			if (!supportsBigInt) {
				return;
			}

			void it(big, () => {
				const el = new ValueInteger(BigInt(big));
				strictEqual(el.toXml(), `<integer>${big}</integer>`);
				strictEqual(el.toXml(null, 1), `\t<integer>${big}</integer>`);
			});

			void it(bigPos, () => {
				const el = new ValueInteger(BigInt(bigPos));
				strictEqual(el.toXml(), `<integer>${big}</integer>`);
				strictEqual(el.toXml(null, 1), `\t<integer>${big}</integer>`);
			});

			void it(bigNeg, () => {
				const el = new ValueInteger(BigInt(bigNeg));
				strictEqual(el.toXml(), `<integer>${bigNeg}</integer>`);
				strictEqual(
					el.toXml(null, 1),
					`\t<integer>${bigNeg}</integer>`
				);
			});
		});

		void describe('fromXml', () => {
			void it('42', () => {
				const el = new ValueInteger();
				el.fromXml('<integer>42</integer>');
				strictEqual(el.value, 42);
			});

			void it('3.14', () => {
				const el = new ValueInteger();
				throws(() => {
					el.fromXml('<integer>3.14</integer>');
				});
			});

			void it('empty', () => {
				const el = new ValueInteger();
				throws(() => {
					el.fromXml('<integer/>');
				});
				throws(() => {
					el.fromXml('<integer></integer>');
				});
			});

			void it('baddata', () => {
				const el = new ValueInteger();
				throws(() => {
					el.fromXml('<real>baddata</real>');
				});
			});

			void it('children', () => {
				const el = new ValueInteger();
				throws(() => {
					el.fromXml('<integer><a/></integer>');
				});
			});

			void it('badtag', () => {
				const el = new ValueInteger();
				throws(() => {
					el.fromXml('<bad/>');
				});
				throws(() => {
					el.fromXml('<bad></bad>');
				});
			});

			if (!supportsBigInt) {
				return;
			}

			void it(big, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${big}</integer>`);
				strictEqual(el.value, BigInt(big));
			});

			void it(bigPos, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${bigPos}</integer>`);
				strictEqual(el.value, BigInt(bigPos));
			});

			void it(bigNeg, () => {
				const el = new ValueInteger();
				el.fromXml(`<integer>${bigNeg}</integer>`);
				strictEqual(el.value, BigInt(bigNeg));
			});
		});
	});
});
