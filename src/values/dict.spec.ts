/* eslint-env jasmine */
/* eslint-disable max-nested-callbacks */

import {
	Value
} from '../value';

import {
	ValueDict
} from './dict';

describe('values/dict', () => {
	describe('ValueDict', () => {
		describe('constructor', () => {
			it('length: 0', () => {
				const m = new Map<string, Value>();
				const el = new ValueDict(m);
				expect(el.value).toBe(m);
			});

			it('length: 1', () => {
				const m = new Map<string, Value>();
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				expect(el.value).toBe(m);
			});

			it('length: 2', () => {
				const m = new Map<string, Value>();
				m.set('something', new ValueDict());
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				expect(el.value).toBe(m);
			});
		});

		describe('toXml', () => {
			it('length: 0', () => {
				const el = new ValueDict();
				expect(el.toXml()).toBe('<dict/>');
				expect(el.toXml(null, 1)).toBe('\t<dict/>');
			});

			it('length: 1', () => {
				const m = new Map<string, Value>();
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				expect(el.toXml()).toBe([
					'<dict>',
					'\t<key>&lt;&amp;&gt;</key>',
					'\t<dict/>',
					'</dict>'
				].join('\n'));
				expect(el.toXml(null, 1)).toBe([
					'\t<dict>',
					'\t\t<key>&lt;&amp;&gt;</key>',
					'\t\t<dict/>',
					'\t</dict>'
				].join('\n'));
			});

			it('length: 2', () => {
				const m = new Map<string, Value>();
				m.set('something', new ValueDict());
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				expect(el.toXml()).toBe([
					'<dict>',
					'\t<key>something</key>',
					'\t<dict/>',
					'\t<key>&lt;&amp;&gt;</key>',
					'\t<dict/>',
					'</dict>'
				].join('\n'));
				expect(el.toXml(null, 1)).toBe([
					'\t<dict>',
					'\t\t<key>something</key>',
					'\t\t<dict/>',
					'\t\t<key>&lt;&amp;&gt;</key>',
					'\t\t<dict/>',
					'\t</dict>'
				].join('\n'));
			});
		});

		describe('fromXml', () => {
			it('size: 0', () => {
				const el = new ValueDict();
				el.fromXml('<dict></dict>');
				expect(el.value.size).toBe(0);
			});

			it('size: 1', () => {
				const el = new ValueDict();
				el.fromXml([
					'<dict>',
					'<key>&lt;&amp;&gt;</key>',
					'<true/>',
					'</dict>'
				].join('\n'));
				expect(el.value.size).toBe(1);
				expect(el.value.get('<&>')).toBeTruthy();
			});

			it('size: 2', () => {
				const el = new ValueDict();
				el.fromXml([
					'<dict>',
					'<key>test</key>',
					'<true/>',
					'<key>&lt;&amp;&gt;</key>',
					'<true/>',
					'</dict>'
				].join('\n'));
				expect(el.value.size).toBe(2);
				expect(el.value.get('test')).toBeTruthy();
				expect(el.value.get('<&>')).toBeTruthy();
			});

			it('uneven elements', () => {
				const el = new ValueDict();
				expect(() => {
					el.fromXml('<dect><key>test</key></dect>');
				}).toThrow();
			});

			it('text', () => {
				const el = new ValueDict();
				expect(() => {
					el.fromXml('<dect>text</dect>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueDict();
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
