import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {stringChunk, xmlDecode} from './util';

void describe('util', () => {
	void describe('stringChunk', () => {
		void it('exact', () => {
			deepStrictEqual(stringChunk('12345678', 4), ['1234', '5678']);
		});

		void it('extra', () => {
			deepStrictEqual(stringChunk('123456789', 4), ['1234', '5678', '9']);
		});

		void it('less', () => {
			deepStrictEqual(stringChunk('123', 4), ['123']);
		});
	});

	void describe('xmlDecode', () => {
		const declaration = '<?xml version="1.0" encoding="UTF-8"?>';
		const doctype =
			'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';

		void it('declaration', () => {
			const o = xmlDecode(`\n${declaration}\n<xml>a</xml>\n`);
			strictEqual(o.declaration, declaration);
			strictEqual(o.doctype, null);
			strictEqual(o.documentElement.toString(), '<xml>a</xml>');
		});

		void it('doctype', () => {
			const o = xmlDecode(`\n${doctype}\n<xml>a</xml>\n`);
			strictEqual(o.declaration, null);
			strictEqual(o.doctype, doctype);
			strictEqual(o.documentElement.toString(), '<xml>a</xml>');
		});

		void it('declaration + doctype', () => {
			const o = xmlDecode(`\n${declaration}\n${doctype}\n<xml>a</xml>\n`);
			strictEqual(o.declaration, declaration);
			strictEqual(o.doctype, doctype);
			strictEqual(o.documentElement.toString(), '<xml>a</xml>');
		});

		void it('documentElement', () => {
			const o = xmlDecode('\n<xml>a</xml>\n');
			strictEqual(o.declaration, null);
			strictEqual(o.doctype, null);
			strictEqual(o.documentElement.toString(), '<xml>a</xml>');
		});
	});
});
