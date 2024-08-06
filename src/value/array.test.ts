/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {Value} from '../value.ts';

import {ValueArray} from './array.ts';

void describe('value/array', () => {
	void describe('ValueArray', () => {
		void describe('constructor', () => {
			void it('length: 0', () => {
				const a: Value[] = [];
				const el = new ValueArray(a);
				strictEqual(el.value, a);
			});

			void it('length: 1', () => {
				const a: Value[] = [new ValueArray()];
				const el = new ValueArray(a);
				strictEqual(el.value, a);
			});

			void it('length: 2', () => {
				const a: Value[] = [new ValueArray(), new ValueArray()];
				const el = new ValueArray(a);
				strictEqual(el.value, a);
			});
		});

		void describe('toXml', () => {
			void it('length: 0', () => {
				const el = new ValueArray([]);
				strictEqual(el.toXml(), '<array/>');
				strictEqual(el.toXml(null, 1), '\t<array/>');
			});

			void it('length: 1', () => {
				const el = new ValueArray([new ValueArray()]);
				strictEqual(
					el.toXml(),
					['<array>', '\t<array/>', '</array>'].join('\n')
				);
				strictEqual(
					el.toXml(null, 1),
					['\t<array>', '\t\t<array/>', '\t</array>'].join('\n')
				);
			});

			void it('length: 2', () => {
				const el = new ValueArray([new ValueArray(), new ValueArray()]);
				strictEqual(
					el.toXml(),
					['<array>', '\t<array/>', '\t<array/>', '</array>'].join(
						'\n'
					)
				);
				strictEqual(
					el.toXml(null, 1),
					[
						'\t<array>',
						'\t\t<array/>',
						'\t\t<array/>',
						'\t</array>'
					].join('\n')
				);
			});
		});

		void describe('fromXml', () => {
			void it('length: 0', () => {
				const el = new ValueArray([new ValueArray()]);
				el.fromXml('<array></array>');
				strictEqual(el.value.length, 0);
			});

			void it('length: 1', () => {
				const el = new ValueArray();
				el.fromXml('<array><true/></array>');
				strictEqual(el.value.length, 1);
			});

			void it('length: 2', () => {
				const el = new ValueArray();
				el.fromXml('<array><true/><true/></array>');
				strictEqual(el.value.length, 2);
			});

			void it('text', () => {
				const el = new ValueArray();
				throws(() => {
					el.fromXml('<array>text</array>');
				});
			});

			void it('badtag', () => {
				const el = new ValueArray();
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
