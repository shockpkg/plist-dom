import {
	Plist
} from './plist';
import {
	ValueBoolean
} from './values/boolean';

/**
 * Extract plist body XML.
 *
 * @param s XML string.
 * @returns XML body.
 */
function plistBodyExtract(s: string) {
	return s.replace(/^[\s\S]*<plist[^>]*>([\s\S]*)<\/plist>\n*$/, '$1');
}

describe('document', () => {
	describe('Plist', () => {
		describe('constructor', () => {
			it('null', () => {
				const doc = new Plist();
				expect(doc.value).toBeNull();
			});

			it('value', () => {
				const value = new ValueBoolean(true);
				const doc = new Plist(value);
				expect(doc.value).toBe(value);
			});
		});

		describe('toXml', () => {
			it('null', () => {
				const doc = new Plist();
				doc.xmlIndented = false;
				expect(plistBodyExtract(doc.toXml())).toBe('\n');
				doc.xmlIndented = true;
				expect(plistBodyExtract(doc.toXml())).toBe('\n');
			});

			it('true', () => {
				const doc = new Plist(new ValueBoolean(true));
				doc.xmlIndented = false;
				expect(plistBodyExtract(doc.toXml())).toBe('\n<true/>\n');
				doc.xmlIndented = true;
				expect(plistBodyExtract(doc.toXml())).toBe('\n\t<true/>\n');
			});

			it('xmlDeclaration', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				expect(linesA[0]).toBe(doc.xmlDeclaration);

				doc.xmlDeclaration =
					'<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
				const linesB = doc.toXml().split('\n');
				expect(linesB[0]).toBe(doc.xmlDeclaration);
			});

			it('doctype', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				expect(linesA[1]).toBe(doc.xmlDoctype);

				doc.xmlDoctype = '<!DOCTYPE plist PUBLIC "" "">';
				const linesB = doc.toXml().split('\n');
				expect(linesB[1]).toBe(doc.xmlDoctype);
			});

			it('plist tags', () => {
				const doc = new Plist(new ValueBoolean(true));
				const linesA = doc.toXml().split('\n');
				expect(linesA[2]).toBe('<plist version="1.0">');
				expect(linesA[linesA.length - 2]).toBe('</plist>');
			});

			it('trailing newline', () => {
				const doc = new Plist(new ValueBoolean(true));
				const xml = doc.toXml();
				expect(xml.endsWith('\n')).toBe(true);
			});
		});

		describe('fromXml', () => {
			it('null', () => {
				const doc = new Plist();
				const xml = doc.toXml();
				doc.value = new ValueBoolean(true);
				doc.fromXml(xml);
				expect(doc.value).toBeNull();
			});

			it('boolean', () => {
				const doc = new Plist();
				doc.value = new ValueBoolean(false);
				const xml = doc.toXml();
				doc.value = new ValueBoolean(true);
				doc.fromXml(xml);
				const {value} = doc;
				expect(value).toBeTruthy();
				if (value) {
					expect(value.toXml())
						.toBe((new ValueBoolean(false)).toXml());
				}
			});
		});
	});
});
