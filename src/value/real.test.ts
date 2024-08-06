/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {ValueReal} from './real.ts';

void describe('value/real', () => {
	void describe('ValueReal', () => {
		void describe('constructor', () => {
			void it('42', () => {
				const el = new ValueReal(42);
				strictEqual(el.value, 42);
			});

			void it('3.14', () => {
				const el = new ValueReal(3.14);
				strictEqual(el.value, 3.14);
			});
		});

		void describe('toXml', () => {
			void it('42', () => {
				const el = new ValueReal(42);
				strictEqual(el.toXml(), '<real>42</real>');
				strictEqual(el.toXml(null, 1), '\t<real>42</real>');
			});

			void it('3.14', () => {
				const el = new ValueReal();
				el.value = 3.14;
				strictEqual(el.toXml(), '<real>3.14</real>');
			});
		});

		void describe('fromXml', () => {
			void it('42', () => {
				const el = new ValueReal();
				el.fromXml('<real>42</real>');
				strictEqual(el.value, 42);
			});

			void it('42.0', () => {
				const el = new ValueReal();
				el.fromXml('<real>42.0</real>');
				strictEqual(el.value, 42);
			});

			void it('3.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>3.14</real>');
				strictEqual(el.value, 3.14);
			});

			void it('.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>3.14</real>');
				strictEqual(el.value, 3.14);
			});

			void it('0.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>0.14</real>');
				strictEqual(el.value, 0.14);
			});

			void it('-.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>-.14</real>');
				strictEqual(el.value, -0.14);
			});

			void it('+.14', () => {
				const el = new ValueReal();
				el.fromXml('<real>+.14</real>');
				strictEqual(el.value, 0.14);
			});

			void it('empty', () => {
				const el = new ValueReal();
				throws(() => {
					el.fromXml('<real/>');
				});
				throws(() => {
					el.fromXml('<real></real>');
				});
			});

			void it('baddata', () => {
				const el = new ValueReal();
				throws(() => {
					el.fromXml('<real>baddata</real>');
				});
				throws(() => {
					el.fromXml('<real>1.</real>');
				});
			});

			void it('children', () => {
				const el = new ValueReal();
				throws(() => {
					el.fromXml('<real><a/></real>');
				});
			});

			void it('badtag', () => {
				const el = new ValueReal();
				throws(() => {
					el.fromXml('<bad/>');
				});
				throws(() => {
					el.fromXml('<bad></bad>');
				});
			});
		});
	});
});
