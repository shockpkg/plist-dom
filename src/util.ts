import * as entities from 'entities';
// @ts-ignore
import xmldom from 'xmldom';

// Handle module loader differences between CJS and ESM.
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const decodeXML = entities.decodeXML || (entities as any).default.decodeXML;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const encodeXML = entities.encodeXML || (entities as any).default.encodeXML;
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
const {DOMParser} = xmldom;

const numberLimit = 0x1fffffffffffff;

export interface IText {
	nodeValue: string | null;
}

export interface IElement {
	readonly tagName: string;
	childNodes: {
		length: number;
		[index: number]: IElement | IText;
	};
}

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
	// eslint-disable-next-line no-undefined, @typescript-eslint/no-unsafe-return
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
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const parser = new DOMParser({
		locator: {},
		errorHandler: {
			/**
			 * Warning callback.
			 *
			 * @param e Error string.
			 */
			warning: (e: string) => {
				// Ignore warnings.
			},

			/**
			 * Error callback.
			 *
			 * @param e Error string.
			 */
			error: (e: string) => {
				errors.push(e);
			},

			/**
			 * Fatal error callback.
			 *
			 * @param e Error string.
			 */
			fatalError: (e: string) => {
				errors.push(e);
			}
		}
	});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const doc = parser.parseFromString(xml, 'text/xml') as {
		documentElement: Readonly<IElement>;
		childNodes: {}[];
	};
	if (errors.length) {
		throw new Error(`XML decode error: ${errors[0]}`);
	}

	const {childNodes} = doc;
	const documentElement = doc.documentElement || null;

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
export function xmlElementChildElements<T extends Readonly<IElement>>(
	element: T
): T[] {
	const {childNodes} = element;
	const r = [];
	for (let i = 0, l = childNodes.length; i < l; i++) {
		const childNode = childNodes[i];
		if ('tagName' in childNode) {
			r.push(childNode as T);
			continue;
		}
		const {nodeValue} = childNode;
		if (nodeValue && !/^\s*$/.test(nodeValue)) {
			throw new Error(`Found text children of: ${element.tagName}`);
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
export function xmlElementText(element: Readonly<IElement>) {
	const {childNodes} = element;
	let r: IText | null = null;
	for (let i = 0, l = childNodes.length; i < l; i++) {
		if (i) {
			throw new Error(`Multiple child elements in: ${element.tagName}`);
		}

		const childNode = childNodes[i];
		if (
			!('tagName' in childNode) &&
			'data' in childNode &&
			'nodeValue' in childNode
		) {
			r = childNode as IText;
		} else {
			throw new Error(`Unexpected child element in: ${element.tagName}`);
		}
	}
	return r;
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
	for (let s = str; s.length; ) {
		r.push(s.substring(0, len));
		s = s.substring(len);
	}
	return r;
}

/**
 * Decode real from string, or throw.
 *
 * @param str Integer string.
 * @returns Decoded integer.
 */
export function decodeReal(str: string) {
	if (!/^[-+]?([0-9]+|[0-9]*\.[0-9]+)$/.test(str)) {
		throw new Error(`Invalid real data: ${str}`);
	}
	return +str;
}

/**
 * Decode base 10 integer from string, or throw.
 *
 * @param str Integer string.
 * @returns Decoded integer.
 */
export function decodeIntBase10(str: string) {
	if (!/^[-+]?[0-9]+$/.test(str)) {
		throw new Error(`Invalid integer data: ${str}`);
	}
	const num = +str;
	return num > numberLimit || num < -numberLimit ? BigInt(str) : num;
}

/**
 * Assert number is integer.
 *
 * @param value Number value.
 */
export function assertInteger(value: number | BigInt) {
	if (typeof value === 'number' && !Number.isInteger(value)) {
		throw new Error(`Value not an integer: ${value}`);
	}
}
