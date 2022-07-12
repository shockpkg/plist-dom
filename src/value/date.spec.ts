/* eslint-disable max-nested-callbacks */
import {ValueDate} from './date';

describe('value/integer', () => {
	describe('ValueDate', () => {
		describe('constructor', () => {
			it('date', () => {
				const el = new ValueDate(new Date('2019-01-20T10:12:42.000Z'));
				expect(el.value).toEqual(new Date('2019-01-20T10:12:42.000Z'));
			});
		});

		describe('toXml', () => {
			it('date', () => {
				const el = new ValueDate(new Date('2019-01-20T10:12:42.000Z'));
				expect(el.toXml()).toBe('<date>2019-01-20T10:12:42Z</date>');
				expect(el.toXml(null, 1)).toBe(
					'\t<date>2019-01-20T10:12:42Z</date>'
				);
			});
		});

		describe('fromXml', () => {
			it('date', () => {
				const el = new ValueDate();
				el.fromXml('<date>2019-01-20T10:12:42Z</date>');
				expect(el.toXml()).toBe('<date>2019-01-20T10:12:42Z</date>');
			});

			it('empty', () => {
				const el = new ValueDate();
				expect(() => {
					el.fromXml('<date/>');
				}).toThrow();
				expect(() => {
					el.fromXml('<date></date>');
				}).toThrow();
			});

			it('datadata', () => {
				const el = new ValueDate();
				expect(() => {
					el.fromXml('<date>baddata</date>');
				}).toThrow();
			});

			it('children', () => {
				const el = new ValueDate();
				expect(() => {
					el.fromXml('<date><a/></date>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueDate();
				expect(() => {
					el.fromXml('<date/>');
				}).toThrow();
				expect(() => {
					el.fromXml('<date></date>');
				}).toThrow();
			});
		});
	});
});
