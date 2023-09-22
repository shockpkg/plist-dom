/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual, throws} from 'node:assert';

import {ValueDate} from './date';

void describe('value/integer', () => {
	void describe('ValueDate', () => {
		void describe('constructor', () => {
			void it('date', () => {
				const el = new ValueDate(new Date('2019-01-20T10:12:42.000Z'));
				deepStrictEqual(el.value, new Date('2019-01-20T10:12:42.000Z'));
			});
		});

		void describe('toXml', () => {
			void it('date', () => {
				const el = new ValueDate(new Date('2019-01-20T10:12:42.000Z'));
				strictEqual(el.toXml(), '<date>2019-01-20T10:12:42Z</date>');
				strictEqual(
					el.toXml(null, 1),
					'\t<date>2019-01-20T10:12:42Z</date>'
				);
			});
		});

		void describe('fromXml', () => {
			void it('date', () => {
				const el = new ValueDate();
				el.fromXml('<date>2019-01-20T10:12:42Z</date>');
				strictEqual(el.toXml(), '<date>2019-01-20T10:12:42Z</date>');
			});

			void it('empty', () => {
				const el = new ValueDate();
				throws(() => {
					el.fromXml('<date/>');
				});
				throws(() => {
					el.fromXml('<date></date>');
				});
			});

			void it('datadata', () => {
				const el = new ValueDate();
				throws(() => {
					el.fromXml('<date>baddata</date>');
				});
			});

			void it('children', () => {
				const el = new ValueDate();
				throws(() => {
					el.fromXml('<date><a/></date>');
				});
			});

			void it('badtag', () => {
				const el = new ValueDate();
				throws(() => {
					el.fromXml('<date/>');
				});
				throws(() => {
					el.fromXml('<date></date>');
				});
			});
		});
	});
});
