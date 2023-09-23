import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {base64Decode, base64Encode, stringChunk, xmlDecode} from './util';

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

	void describe('base64Encode', () => {
		void it('byte combos: 1', () => {
			const data = Buffer.alloc(1);
			for (let a = 0; a < 256; a++) {
				data[0] = a;
				deepStrictEqual(
					base64Encode(new Uint8Array(data)),
					data.toString('base64')
				);
			}
		});

		void it('byte combos: 2', () => {
			const data = Buffer.alloc(2);
			for (let a = 0; a < 256; a++) {
				data[0] = a;
				for (let b = 0; b < 256; b++) {
					data[1] = b;
					deepStrictEqual(
						base64Encode(new Uint8Array(data)),
						data.toString('base64')
					);
				}
			}
		});

		void it('byte combos: 3', () => {
			const data = Buffer.alloc(3);
			for (let a = 0; a < 256; a++) {
				data[1] = a;
				for (let b = 0; b < 256; b++) {
					data[2] = b;
					deepStrictEqual(
						base64Encode(new Uint8Array(data)),
						data.toString('base64')
					);
				}
			}
		});
	});

	void describe('base64Decode', () => {
		const input = 'ABCDEFGHIJKL';
		for (let i = 0; i <= input.length; i++) {
			void it(`length: ${i}`, () => {
				const s = input.substring(0, i);
				const d = base64Decode(Buffer.from(s).toString('base64'));
				strictEqual(String.fromCharCode(...d), s);
			});
		}

		void it('bytes: 0x00 * 256', () => {
			const bytes = Buffer.alloc(256);
			deepStrictEqual(
				base64Decode(bytes.toString('base64')),
				new Uint8Array(bytes)
			);
		});

		void it('bytes: 0xFF * 256', () => {
			const bytes = Buffer.alloc(256);
			bytes.fill(0xff);
			deepStrictEqual(
				base64Decode(bytes.toString('base64')),
				new Uint8Array(bytes)
			);
		});

		void it('bytes: 0x00-0xFF', () => {
			const bytes = Buffer.alloc(256);
			for (let i = 0; i < 256; i++) {
				bytes[i] = i;
			}
			deepStrictEqual(
				base64Decode(bytes.toString('base64')),
				new Uint8Array(bytes)
			);
		});

		void it('byte combos: 1', () => {
			const data = Buffer.alloc(1);
			for (let a = 0; a < 256; a++) {
				data[0] = a;
				deepStrictEqual(
					base64Decode(data.toString('base64')),
					new Uint8Array(data)
				);
			}
		});

		void it('byte combos: 2', () => {
			const data = Buffer.alloc(2);
			for (let a = 0; a < 256; a++) {
				data[0] = a;
				for (let b = 0; b < 256; b++) {
					data[1] = b;
					deepStrictEqual(
						base64Decode(data.toString('base64')),
						new Uint8Array(data)
					);
				}
			}
		});

		void it('byte combos: 3', () => {
			const data = Buffer.alloc(3);
			for (let a = 0; a < 256; a++) {
				data[1] = a;
				for (let b = 0; b < 256; b++) {
					data[2] = b;
					deepStrictEqual(
						base64Decode(data.toString('base64')),
						new Uint8Array(data)
					);
				}
			}
		});

		for (const [b64, bytes] of [
			['', []],
			['A', []],
			['AB', []],
			['AB__', []],
			['ABCDA', [0, 16, 131]],
			['ABCDAB', [0, 16, 131]],
			['ABCDAB__', [0, 16, 131]],
			['1\x002\x803\xFF4😀5©6==', [215, 109, 248, 231]],
			['AB CD\tEF\rGH\nIJ\0==', [0, 16, 131, 16, 81, 135, 32]],
			['ABCD    EFGH', [0, 16, 131, 16, 81, 135]],
			['\r\nABCD\r\nEFGH\r\n', [0, 16, 131, 16, 81, 135]],
			['YWE=YWE=', [97, 97, 97, 97]],
			['YW=E', [97, 96, 4]],
			['Y=WE', [96, 5, 132]],
			['=YWE', [1, 133, 132]],
			['====', [0]],
			['========', [0, 0]]
		] as [string, number[]][]) {
			void it(JSON.stringify(b64), () => {
				deepStrictEqual(base64Decode(b64), new Uint8Array(bytes));
			});
		}
	});
});
