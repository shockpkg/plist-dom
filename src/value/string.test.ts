/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {ValueString} from './string';

void describe('value/string', () => {
	void describe('ValueString', () => {
		void describe('constructor', () => {
			void it('hello world', () => {
				const el = new ValueString('hello world');
				strictEqual(el.value, 'hello world');
			});

			void it('<&>', () => {
				const el = new ValueString('<&>');
				strictEqual(el.value, '<&>');
			});
		});

		void describe('toXml', () => {
			void it('hello world', () => {
				const el = new ValueString('hello world');
				strictEqual(el.toXml(), '<string>hello world</string>');
				strictEqual(
					el.toXml(null, 1),
					'\t<string>hello world</string>'
				);
			});

			void it(`<'"&"'>`, () => {
				const el = new ValueString(`<'"&"'>`);
				strictEqual(el.toXml(), `<string>&lt;'"&amp;"'&gt;</string>`);
				strictEqual(
					el.toXml(null, 1),
					`\t<string>&lt;'"&amp;"'&gt;</string>`
				);
			});
		});

		void describe('fromXml', () => {
			void it('hello world', () => {
				const el = new ValueString('');
				el.fromXml('<string>hello world</string>');
				strictEqual(el.value, 'hello world');
			});

			void it(`<'"&"'>`, () => {
				const el = new ValueString('');
				el.fromXml(`<string>&lt;'"&amp;"'&gt;</string>`);
				strictEqual(el.value, `<'"&"'>`);
			});

			void it('empty', () => {
				const el = new ValueString('test');
				el.fromXml('<string/>');
				el.value = 'test';
				el.fromXml('<string></string>');
				strictEqual(el.value, '');
			});

			void it('children', () => {
				const el = new ValueString('');
				throws(() => {
					el.fromXml('<string><a/></string>');
				});
			});

			void it('badtag', () => {
				const el = new ValueString('test');
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
