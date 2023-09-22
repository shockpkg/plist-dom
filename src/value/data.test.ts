/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {ValueData} from './data';

void describe('value/data', () => {
	void describe('ValueData', () => {
		void describe('constructor', () => {
			void it('length: 0', () => {
				const el = new ValueData();
				strictEqual(el.value.toString('base64'), '');
			});

			void it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				strictEqual(el.value, b);
			});
		});

		void describe('toXml', () => {
			void it('length: 0', () => {
				const el = new ValueData();
				strictEqual(
					el.toXml({
						dataColumns: 6
					}),
					'<data>\n</data>'
				);
				strictEqual(
					el.toXml(
						{
							dataColumns: 6
						},
						1
					),
					'\t<data>\n\t</data>'
				);
			});

			void it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				strictEqual(el.toXml(), '<data>\nAAAAAAAAAAAAAA==\n</data>');
				strictEqual(
					el.toXml(null, 1),
					'\t<data>\n\tAAAAAAAAAAAAAA==\n\t</data>'
				);
			});

			void it('length: 10 wrapped', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				strictEqual(
					el.toXml({
						dataColumns: 6
					}),
					'<data>\nAAAAAA\nAAAAAA\nAA==\n</data>'
				);
				strictEqual(
					el.toXml(
						{
							dataColumns: 6
						},
						1
					),
					'\t<data>\n\tAAAAAA\n\tAAAAAA\n\tAA==\n\t</data>'
				);
			});
		});

		void describe('fromXml', () => {
			void it('length: 0', () => {
				const b = Buffer.alloc(0);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(1);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 1', () => {
				const b = Buffer.alloc(1);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 2', () => {
				const b = Buffer.alloc(2);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 3', () => {
				const b = Buffer.alloc(3);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 100', () => {
				const b = Buffer.alloc(100);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('length: 100', () => {
				const b = Buffer.alloc(100);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				strictEqual(el.value.toString('base64'), b.toString('base64'));
			});

			void it('charset', () => {
				const el = new ValueData();
				el.fromXml(
					[
						'<data>',
						'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
						'abcdefghijklmnopqrstuvwxyz',
						'0123456789+/',
						'</data>'
					].join('\n')
				);
				strictEqual(el.value.length, 48);
			});

			void it('baddata', () => {
				const el = new ValueData();
				throws(() => {
					el.fromXml('<data>-</data>');
				});
			});

			void it('children', () => {
				const el = new ValueData();
				throws(() => {
					el.fromXml('<data><a/></data>');
				});
			});

			void it('badtag', () => {
				const el = new ValueData();
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
