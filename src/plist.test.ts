/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {ok, strictEqual, throws} from 'node:assert';
import {readFile} from 'node:fs/promises';

import {Plist} from './plist';
import {ValueBoolean} from './value/boolean';
import {ValueString} from './value/string';

/**
 * Extract plist body XML.
 *
 * @param s XML string.
 * @returns XML body.
 */
function plistBodyExtract(s: string) {
	return s.replace(/^[\S\s]*<plist[^>]*>([\S\s]*)<\/plist>\n*$/, '$1');
}

void describe('document', () => {
	void describe('Plist', () => {
		void void describe('constructor', () => {
			void void it('null', () => {
				const doc = new Plist();
				strictEqual(doc.value, null);
			});

			void it('value', () => {
				const value = new ValueBoolean(true);
				const doc = new Plist(value);
				strictEqual(doc.value, value);
			});
		});

		void describe('getValue', () => {
			void it('null', () => {
				const doc = new Plist();
				throws(() => doc.getValue());
			});

			void it('boolean', () => {
				const doc = new Plist(new ValueBoolean());
				ok(doc.getValue());
			});
		});

		void describe('valueCastTo', () => {
			void it('null', () => {
				const doc = new Plist();
				strictEqual(doc.valueCastTo(ValueString), null);
			});

			void it('same type', () => {
				const doc = new Plist(new ValueBoolean());
				ok(doc.valueCastTo(ValueBoolean));
			});

			void it('different type', () => {
				const doc = new Plist(new ValueBoolean());
				strictEqual(doc.valueCastTo(ValueString), null);
			});
		});

		void describe('valueCastAs', () => {
			void it('null', () => {
				const doc = new Plist();
				throws(() => doc.valueCastAs(ValueString));
			});

			void it('same type', () => {
				const doc = new Plist(new ValueBoolean());
				ok(doc.valueCastAs(ValueBoolean));
			});

			void it('different type', () => {
				const doc = new Plist(new ValueBoolean());
				throws(() => doc.valueCastAs(ValueString));
			});
		});

		void describe('toXml', () => {
			void it('null', () => {
				const doc = new Plist();
				strictEqual(
					plistBodyExtract(
						doc.toXml({
							indentRoot: false
						})
					),
					'\n'
				);
				strictEqual(
					plistBodyExtract(
						doc.toXml({
							indentRoot: true
						})
					),
					'\n'
				);
			});

			void it('true', () => {
				const doc = new Plist(new ValueBoolean(true));
				strictEqual(
					plistBodyExtract(
						doc.toXml({
							indentRoot: false
						})
					),
					'\n<true/>\n'
				);
				strictEqual(
					plistBodyExtract(
						doc.toXml({
							indentRoot: true
						})
					),
					'\n\t<true/>\n'
				);
			});

			void it('xmlDeclaration', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				strictEqual(linesA[0], doc.xmlDeclaration);

				doc.xmlDeclaration =
					'<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
				const linesB = doc.toXml().split('\n');
				strictEqual(linesB[0], doc.xmlDeclaration);
			});

			void it('doctype', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				strictEqual(linesA[1], doc.xmlDoctype);

				doc.xmlDoctype = '<!DOCTYPE plist PUBLIC "" "">';
				const linesB = doc.toXml().split('\n');
				strictEqual(linesB[1], doc.xmlDoctype);
			});

			void it('plist tags', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				strictEqual(linesA[2], '<plist version="1.0">');
				strictEqual(linesA.at(-2), '</plist>');
			});

			void it('trailing newline', () => {
				const doc = new Plist(new ValueBoolean(true));
				const xml = doc.toXml();
				strictEqual(xml.endsWith('\n'), true);
			});
		});

		void describe('fromXml', () => {
			void it('null', () => {
				const doc = new Plist();
				const xml = doc.toXml();
				doc.value = new ValueBoolean(true);
				doc.fromXml(xml);
				strictEqual(doc.value, null);
			});

			void it('boolean', () => {
				const doc = new Plist();
				doc.value = new ValueBoolean(false);
				const xml = doc.toXml();
				doc.value = new ValueBoolean(true);
				doc.fromXml(xml);
				const {value} = doc;
				ok(value);
				if (value) {
					strictEqual(value.toXml(), new ValueBoolean(false).toXml());
				}
			});

			void it('hdiutil', async () => {
				const xml = await readFile(
					'./spec/fixtures/hdiutil.plist',
					'utf8'
				);
				const doc = new Plist();
				doc.fromXml(xml);
			});
		});
	});
});
