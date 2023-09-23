import {DOMParser} from '@xmldom/xmldom';

const B6 = 0x3f;
const B8 = 0xff;
const C64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const C64M = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60,
	61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
	13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1,
	26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
	45, 46, 47, 48, 49, 50, 51
];

export interface IText {
	nodeValue: string | null;
}

export interface IElement {
	readonly tagName: string;
	childNodes: {
		length: number;
		[index: number]: IElement | IText;
	};
	toString: () => string;
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
	const doc = parser.parseFromString(xml, 'text/xml') as unknown as {
		documentElement: Readonly<IElement>;
		childNodes: {toString: () => string}[];
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
 * Assert XML element has no children.
 *
 * @param element XML element.
 * @param tagName XML element tag name.
 */
export function assertXmlTagName(element: Readonly<IElement>, tagName: string) {
	const tn = element.tagName;
	if (tn !== tagName) {
		throw new Error(`Unexpected tagName: ${tagName}`);
	}
}

/**
 * Assert XML element has no children.
 *
 * @param element XML element.
 */
export function assertNoXmlElementChildNodes(element: Readonly<IElement>) {
	const {childNodes} = element;
	if (childNodes.length) {
		throw new Error(`Unexpected child nodes: ${element.tagName}`);
	}
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
	for (let s = str; s; s = s.substring(len)) {
		r.push(s.substring(0, len));
	}
	return r;
}

/**
 * Base64 encode function mirroring decode function.
 *
 * @param data Byte array.
 * @returns Base64 string.
 */
export function base64Encode(data: Uint8Array) {
	const l = data.length;
	let r = '';
	for (let i = 0; i < l; ) {
		const a = data[i++];
		const b = i < l ? data[i++] : null;
		const c = i < l ? data[i++] : null;
		// eslint-disable-next-line no-bitwise
		const o = (a << 16) | ((b || 0) << 8) | (c || 0);
		r +=
			// eslint-disable-next-line no-bitwise
			C64[o >> 18] +
			// eslint-disable-next-line no-bitwise
			C64[(o >> 12) & B6] +
			// eslint-disable-next-line no-bitwise
			C64[b === null ? 64 : (o >> 6) & B6] +
			// eslint-disable-next-line no-bitwise
			C64[c === null ? 64 : o & B6];
	}
	return r;
}

/**
 * Base64 decode function that matches plist parsing behavior.
 *
 * @param base64 Base64 string.
 * @returns Byte array.
 */
export function base64Decode(base64: string) {
	const l = base64.length;
	const r = [];
	OUTER: for (let a, b, c, d, m, z, i = 0; i < l; ) {
		for (;;) {
			if ((m = C64M[base64.charCodeAt(i++)]) >= 0) {
				a = m;
				break;
			}
			if (i >= l) {
				break OUTER;
			}
		}
		for (;;) {
			if ((m = C64M[base64.charCodeAt(i++)]) >= 0) {
				b = m;
				break;
			}
			if (i >= l) {
				break OUTER;
			}
		}
		for (;;) {
			if ((m = C64M[base64.charCodeAt(i++)]) >= 0) {
				c = m;
				break;
			}
			if (i >= l) {
				break OUTER;
			}
		}
		for (;;) {
			if ((m = C64M[base64.charCodeAt(i++)]) >= 0) {
				d = m;
				break;
			}
			if (i >= l) {
				break OUTER;
			}
		}
		// eslint-disable-next-line no-bitwise
		z = ((a & B6) << 18) | ((b & B6) << 12) | ((c & B6) << 6) | (d & B6);
		// eslint-disable-next-line default-case, no-nested-ternary
		switch (c > B6 ? (d > B6 ? 2 : 0) : d > B6 ? 1 : 0) {
			case 0: {
				// eslint-disable-next-line no-bitwise
				r.push((z >> 16) & B8, (z >> 8) & B8, z & B8);
				break;
			}
			case 1: {
				// eslint-disable-next-line no-bitwise
				r.push((z >> 16) & B8, (z >> 8) & B8);
				break;
			}
			case 2: {
				// eslint-disable-next-line no-bitwise
				r.push((z >> 16) & B8);
				break;
			}
		}
	}
	return new Uint8Array(r);
}
