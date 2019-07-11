import {
	IToXmlOptioned,
	IToXmlOptions,
	toXmlOptionsOptioned
} from './options';
import {
	xmlDecode,
	xmlElementText
} from './util';

/**
 * Value constructor.
 */
export abstract class Value extends Object {
	/**
	 * Value type.
	 */
	public static readonly TYPE: string;

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES: string[];

	constructor() {
		super();
	}

	/**
	 * Value type.
	 */
	public get type() {
		return (this.constructor as typeof Value).TYPE;
	}

	/**
	 * Encode Value to string.
	 *
	 * @param options Options object.
	 * @param depth Indent depth.
	 * @return Xml string.
	 */
	public toXml(options: IToXmlOptions | null = null, depth = 0) {
		return this._toXml(toXmlOptionsOptioned(options), depth);
	}

	/**
	 * Decode document from string.
	 *
	 * @param xml XML string.
	 */
	public fromXml(xml: string) {
		const {documentElement} = xmlDecode(xml);
		this.fromXmlElement(documentElement);
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element
	 */
	public abstract fromXmlElement(element: Element): void;

	/**
	 * Get XML element text.
	 *
	 * @param element XML element
	 */
	protected _getXmlElementText(element: Element) {
		const el = xmlElementText(element);
		return el ? el.nodeValue : '';
	}

	/**
	 * Assert XML element has no children.
	 *
	 * @param element XML element
	 */
	protected _assertNoXmlElementChildNodes(element: Element) {
		const childNodes = element.childNodes;
		if (childNodes.length) {
			throw new Error(`Unexpected child nodes: ${element.tagName}`);
		}
	}

	/**
	 * Assert XML element has no children.
	 *
	 * @param element XML element
	 * @param tagName XML element tag name
	 */
	protected _assertXmlTagname(element: Element, tagName: string) {
		const tn = element.tagName;
		if (tn !== tagName) {
			throw this._errorUnexpectedTagname(tn);
		}
	}

	/**
	 * Create unexpected tagName error.
	 *
	 * @param tagName XML element tag name
	 * @return Error object.
	 */
	protected _errorUnexpectedTagname(tagName: string) {
		return new Error(`Unexpected tagName: ${tagName}`);
	}

	/**
	 * Encode Value to string.
	 *
	 * @param optioned Optioned object.
	 * @param depth Indent depth.
	 * @return XML string.
	 */
	protected abstract _toXml(optioned: IToXmlOptioned, depth: number): string;
}
