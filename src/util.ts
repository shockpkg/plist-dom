import {DOMParser} from '@xmldom/xmldom';

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
