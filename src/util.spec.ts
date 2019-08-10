/* eslint-env jasmine */

import {
	stringChunk,
	xmlDecode
} from './util';

describe('util', () => {
	describe('stringChunk', () => {
		it('exact', () => {
			expect(stringChunk('12345678', 4)).toEqual(['1234', '5678']);
		});

		it('extra', () => {
			expect(stringChunk('123456789', 4)).toEqual(['1234', '5678', '9']);
		});

		it('less', () => {
			expect(stringChunk('123', 4)).toEqual(['123']);
		});
	});

	describe('xmlDecode', () => {
		const declaration = '<?xml version="1.0" encoding="UTF-8"?>';
		const doctype = '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';

		it('declaration', () => {
			const o = xmlDecode(`\n${declaration}\n<xml>a</xml>\n`);
			expect(o.declaration).toBe(declaration);
			expect(o.doctype).toBeNull();
			expect(o.documentElement.toString()).toBe('<xml>a</xml>');
		});

		it('doctype', () => {
			const o = xmlDecode(`\n${doctype}\n<xml>a</xml>\n`);
			expect(o.declaration).toBeNull();
			expect(o.doctype).toBe(doctype);
			expect(o.documentElement.toString()).toBe('<xml>a</xml>');
		});

		it('declaration + doctype', () => {
			const o = xmlDecode(`\n${declaration}\n${doctype}\n<xml>a</xml>\n`);
			expect(o.declaration).toBe(declaration);
			expect(o.doctype).toBe(doctype);
			expect(o.documentElement.toString()).toBe('<xml>a</xml>');
		});

		it('documentElement', () => {
			const o = xmlDecode('\n<xml>a</xml>\n');
			expect(o.declaration).toBeNull();
			expect(o.doctype).toBeNull();
			expect(o.documentElement.toString()).toBe('<xml>a</xml>');
		});
	});
});
