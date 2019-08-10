import {
	decodeXML,
	encodeXML
} from 'entities';
// @ts-ignore
import {DOMParser} from 'xmldom';

/**
 * Default value if value is undefined.
 *
 * @param value Value.
 * @param defaultValue Default value.
 * @returns Value or the default value if undefined.
 */
export function defaultValue<T, U>(
	value: T,
	defaultValue: U
): Exclude<T | U, undefined> {
	// eslint-disable-next-line no-undefined
	return value === undefined ? defaultValue : (value as any);
}

/**
 * Default null if value is undefined.
 *
 * @param value Value.
 * @returns Value or null if undefined.
 */
export function defaultNull<T>(value: T) {
	return defaultValue(value, null);
}

/**
 * Default false if value is undefined.
 *
 * @param value Value.
 * @returns Value or false if undefined.
 */
export function defaultFalse<T>(value: T) {
	return defaultValue(value, false);
}

/**
 * Default true if value is undefined.
 *
 * @param value Value.
 * @returns Value or true if undefined.
 */
export function defaultTrue<T>(value: T) {
	return defaultValue(value, true);
}

/**
 * Encode string for XML.
 *
 * @param value String value.
 * @returns Escaped string.
 */
export function xmlEntitiesEncode(value: string) {
	return encodeXML(value);
}

/**
 * Decode string for XML.
 *
 * @param value Encoded value.
 * @returns Decoded string.
 */
export function xmlEntitiesDecode(value: string) {
	return decodeXML(value);
}

/**
 * Decode an XML string.
 *
 * @param xml XML string.
 * @returns Decoded declaration, doctype, and document element.
 */
export function xmlDecode(xml: string) {
	let declaration: string | null = null;
	let doctype: string | null = null;

	const errors: string[] = [];
	const parser = new DOMParser({
		locator: {},
		errorHandler: {
			warning: (e: string) => {
				// Ignore warnings.
			},
			error: (e: string) => {
				errors.push(e);
			},
			fatalError: (e: string) => {
				errors.push(e);
			}
		}
	});
	const doc = parser.parseFromString(xml, 'text/xml');
	if (errors.length) {
		throw new Error(`XML decode error: ${errors[0]}`);
	}

	const {childNodes} = doc;
	const documentElement =
		(doc.documentElement as (Element | null)) || null;

	for (let i = 0, l = childNodes.length; i < l; i++) {
		const childNode = childNodes[i];
		if (childNode === documentElement) {
			break;
		}
		const str = childNode.toString();
		if (/^<\?xml[^>]*\?>$/.test(str)) {
			declaration = str;
		}
		if (/^<!DOCTYPE[^>]*>$/.test(str)) {
			doctype = str;
		}
	}

	if (!documentElement) {
		throw new Error('XML decode error: No document element');
	}

	return {
		declaration,
		doctype,
		documentElement
	};
}

/**
 * List XML element child elements.
 * Throws if non-whitespace nodes are found.
 *
 * @param element XML element.
 * @returns XML element list.
 */
export function xmlElementChildElements(element: Element) {
	const {childNodes} = element;
	const r: Element[] = [];
	for (let i = 0, l = childNodes.length; i < l; i++) {
		const childNode = childNodes[i];
		if ('tagName' in childNode) {
			r.push(childNode);
			continue;
		}
		const {nodeValue} = childNode;
		if (nodeValue && !/^\s*$/.test(nodeValue)) {
			throw new Error(`Found non-element children: ${element.tagName}`);
		}
	}
	return r;
}

/**
 * Get the XML element text node.
 * Returns null if none, throws if multiple elements.
 *
 * @param element XML element.
 * @returns XML text node list.
 */
export function xmlElementText(element: Element) {
	const {childNodes} = element;
	let r: Text | null = null;
	for (let i = 0, l = childNodes.length; i < l; i++) {
		if (i) {
			throw new Error(`Multiple child elements: ${element.tagName}`);
		}

		const childNode = childNodes[i];
		if (
			!('tagName' in childNode) &&
			'data' in childNode &&
			'nodeValue' in childNode
		) {
			r = childNode;
		}
		else {
			throw new Error(`Unexpected child element: ${element.tagName}`);
		}
	}
	return r as (Text | null);
}

/**
 * Chunk a string into substrings by a length.
 *
 * @param str Original string.
 * @param len Chunk sizes.
 * @returns String chunks.
 */
export function stringChunk(str: string, len: number) {
	const r: string[] = [];
	for (let s = str; s.length;) {
		r.push(s.substr(0, len));
		s = s.substr(len);
	}
	return r;
}

/**
 * Decode base 10 integer from string, or throw.
 *
 * @param str Integer string.
 * @returns Decoded integer.
 */
export function decodeIntBase10(str: string) {
	const v = +str;
	if (!/^[0-9]+$/.test(str) || !Number.isInteger(v)) {
		throw new Error(`Invalid integer data: ${str}`);
	}
	return v;
}

/**
 * Assert number if integer.
 *
 * @param value Number value.
 */
export function assertInteger(value: number) {
	if (!Number.isInteger(value)) {
		throw new Error(`Value not an integer: ${value}`);
	}
}
