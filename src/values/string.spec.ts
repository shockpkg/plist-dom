/* eslint-env jasmine */
/* eslint-disable max-nested-callbacks */

import {
	ValueString
} from './string';

describe('values/string', () => {
	describe('ValueString', () => {
		describe('constructor', () => {
			it('hello world', () => {
				const el = new ValueString('hello world');
				expect(el.value).toBe('hello world');
			});

			it('<&>', () => {
				const el = new ValueString('<&>');
				expect(el.value).toBe('<&>');
			});
		});

		describe('toXml', () => {
			it('hello world', () => {
				const el = new ValueString('hello world');
				expect(el.toXml()).toBe('<string>hello world</string>');
				expect(el.toXml(null, 1))
					.toBe('\t<string>hello world</string>');
			});

			it('<&>', () => {
				const el = new ValueString('<&>');
				expect(el.toXml()).toBe('<string>&lt;&amp;&gt;</string>');
				expect(el.toXml(null, 1))
					.toBe('\t<string>&lt;&amp;&gt;</string>');
			});
		});

		describe('fromXml', () => {
			it('hello world', () => {
				const el = new ValueString('');
				el.fromXml('<string>hello world</string>');
				expect(el.value).toBe('hello world');
			});

			it('<&>', () => {
				const el = new ValueString('');
				el.fromXml('<string>&lt;&amp;&gt;</string>');
				expect(el.value).toBe('<&>');
			});

			it('empty', () => {
				const el = new ValueString('test');
				el.fromXml('<string/>');
				el.value = 'test';
				el.fromXml('<string></string>');
				expect(el.value).toBe('');
			});

			it('children', () => {
				const el = new ValueString('');
				expect(() => {
					el.fromXml('<string><a/></string>');
				}).toThrow();
			});

			it('badtag', () => {
				const el = new ValueString('test');
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
