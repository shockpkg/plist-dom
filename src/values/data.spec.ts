import {
	ValueData
} from './data';

describe('values/data', () => {
	describe('ValueData', () => {
		describe('constructor', () => {
			it('length: 0', () => {
				const el = new ValueData();
				expect(el.value.toString('base64')).toBe('');
			});

			it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				expect(el.value).toBe(b);
			});
		});

		describe('toXml', () => {
			it('length: 0', () => {
				const el = new ValueData();
				expect(el.toXml({
					dataColumns: 6
				})).toBe('<data>\n</data>');
				expect(el.toXml({
					dataColumns: 6
				}, 1))
					.toBe('\t<data>\n\t</data>');
			});

			it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				expect(el.toXml()).toBe('<data>\nAAAAAAAAAAAAAA==\n</data>');
				expect(el.toXml(null, 1))
					.toBe('\t<data>\n\tAAAAAAAAAAAAAA==\n\t</data>');
			});

			it('length: 10 wrapped', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				expect(el.toXml({
					dataColumns: 6
				})).toBe('<data>\nAAAAAA\nAAAAAA\nAA==\n</data>');
				expect(el.toXml({
					dataColumns: 6
				}, 1))
					.toBe('\t<data>\n\tAAAAAA\n\tAAAAAA\n\tAA==\n\t</data>');
			});
		});

		describe('fromXml', () => {
			it('length: 0', () => {
				const b = Buffer.alloc(0);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(1);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 1', () => {
				const b = Buffer.alloc(1);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 2', () => {
				const b = Buffer.alloc(2);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 3', () => {
				const b = Buffer.alloc(3);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 10', () => {
				const b = Buffer.alloc(10);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 100', () => {
				const b = Buffer.alloc(100);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('length: 100', () => {
				const b = Buffer.alloc(100);
				const el = new ValueData(b);
				const xml = el.toXml();
				el.value = Buffer.alloc(0);
				el.fromXml(xml);
				expect(el.value.toString('base64')).toBe(b.toString('base64'));
			});

			it('charset', () => {
				const el = new ValueData();
				el.fromXml([
					'<data>',
					'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
					'abcdefghijklmnopqrstuvwxyz',
					'0123456789+/',
					'</data>'
				].join('\n'));
				expect(el.value.length).toBe(48);
			});

			it('baddata', () => {
				const el = new ValueData();
				expect(() => {
					el.fromXml('<data>-</data>');
				}).toThrow();
			});

			it('children', () => {
				const el = new ValueData();
				expect(() => {
					el.fromXml('<data><a/></data>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueData();
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
