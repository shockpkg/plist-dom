/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {ok, strictEqual, throws} from 'node:assert';

import {Value} from '../value.ts';

import {ValueDict} from './dict.ts';

void describe('value/dict', () => {
	void describe('ValueDict', () => {
		void describe('constructor', () => {
			void it('length: 0', () => {
				const m = new Map<string, Value>();
				const el = new ValueDict(m);
				strictEqual(el.value, m);
			});

			void it('length: 1', () => {
				const m = new Map<string, Value>();
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				strictEqual(el.value, m);
			});

			void it('length: 2', () => {
				const m = new Map<string, Value>();
				m.set('something', new ValueDict());
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				strictEqual(el.value, m);
			});
		});

		void describe('toXml', () => {
			void it('length: 0', () => {
				const el = new ValueDict();
				strictEqual(el.toXml(), '<dict/>');
				strictEqual(el.toXml(null, 1), '\t<dict/>');
			});

			void it('length: 1', () => {
				const m = new Map<string, Value>();
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				strictEqual(
					el.toXml(),
					[
						'<dict>',
						'\t<key>&lt;&amp;&gt;</key>',
						'\t<dict/>',
						'</dict>'
					].join('\n')
				);
				strictEqual(
					el.toXml(null, 1),
					[
						'\t<dict>',
						'\t\t<key>&lt;&amp;&gt;</key>',
						'\t\t<dict/>',
						'\t</dict>'
					].join('\n')
				);
			});

			void it('length: 2', () => {
				const m = new Map<string, Value>();
				m.set('something', new ValueDict());
				m.set('<&>', new ValueDict());
				const el = new ValueDict(m);
				strictEqual(
					el.toXml(),
					[
						'<dict>',
						'\t<key>something</key>',
						'\t<dict/>',
						'\t<key>&lt;&amp;&gt;</key>',
						'\t<dict/>',
						'</dict>'
					].join('\n')
				);
				strictEqual(
					el.toXml(null, 1),
					[
						'\t<dict>',
						'\t\t<key>something</key>',
						'\t\t<dict/>',
						'\t\t<key>&lt;&amp;&gt;</key>',
						'\t\t<dict/>',
						'\t</dict>'
					].join('\n')
				);
			});
		});

		void describe('fromXml', () => {
			void it('size: 0', () => {
				const el = new ValueDict();
				el.fromXml('<dict></dict>');
				strictEqual(el.value.size, 0);
			});

			void it('size: 1', () => {
				const el = new ValueDict();
				el.fromXml(
					[
						'<dict>',
						'<key>&lt;&amp;&gt;</key>',
						'<true/>',
						'</dict>'
					].join('\n')
				);
				strictEqual(el.value.size, 1);
				ok(el.value.get('<&>'));
			});

			void it('size: 2', () => {
				const el = new ValueDict();
				el.fromXml(
					[
						'<dict>',
						'<key>test</key>',
						'<true/>',
						'<key>&lt;&amp;&gt;</key>',
						'<true/>',
						'</dict>'
					].join('\n')
				);
				strictEqual(el.value.size, 2);
				ok(el.value.get('test'));
				ok(el.value.get('<&>'));
			});

			void it('uneven elements', () => {
				const el = new ValueDict();
				throws(() => {
					el.fromXml('<dect><key>test</key></dect>');
				});
			});

			void it('text', () => {
				const el = new ValueDict();
				throws(() => {
					el.fromXml('<dect>text</dect>');
				});
			});

			void it('badtag', () => {
				const el = new ValueDict();
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
