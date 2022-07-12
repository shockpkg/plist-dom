import {IToXmlOptioned, IToXmlOptions, toXmlOptionsOptioned} from './options';
import {IElement, xmlDecode, xmlElementText} from './util';

/**
 * Value object.
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

	/**
	 * Value constructor.
	 */
	constructor() {
		super();
	}

	/**
	 * Value type.
	 *
	 * @returns Type string.
	 */
	public get type() {
		return (this.constructor as typeof Value).TYPE;
	}

	/**
	 * Cast to specific type or null.
	 *
	 * @param Type Type constructor.
	 * @returns This object or null.
	 */
	public castTo<T extends typeof Value>(Type: T): T['prototype'] | null {
		return this.type === Type.TYPE ? this : null;
	}

	/**
	 * Cast to specific type or throw.
	 *
	 * @param Type Type constructor.
	 * @returns This object.
	 */
	public castAs<T extends typeof Value>(Type: T): T['prototype'] {
		const casted = this.castTo(Type);
		if (!casted) {
			throw new Error(
				`Cannot cast type '${this.type}' to '${Type.TYPE}'`
			);
		}
		return casted;
	}

	/**
	 * Encode Value to string.
	 *
	 * @param options Options object.
	 * @param depth Indent depth.
	 * @returns Xml string.
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
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
	 * Get XML element text.
	 *
	 * @param element XML element.
	 * @returns Element text.
	 */
	protected _getXmlElementText(element: Readonly<IElement>) {
		const el = xmlElementText(element);
		return el ? el.nodeValue : '';
	}

	/**
	 * Assert XML element has no children.
	 *
	 * @param element XML element.
	 */
	protected _assertNoXmlElementChildNodes(element: Readonly<IElement>) {
		const {childNodes} = element;
		if (childNodes.length) {
			throw new Error(`Unexpected child nodes: ${element.tagName}`);
		}
	}

	/**
	 * Assert XML element has no children.
	 *
	 * @param element XML element.
	 * @param tagName XML element tag name.
	 */
	protected _assertXmlTagname(element: Readonly<IElement>, tagName: string) {
		const tn = element.tagName;
		if (tn !== tagName) {
			throw this._errorUnexpectedTagname(tn);
		}
	}

	/**
	 * Create unexpected tagName error.
	 *
	 * @param tagName XML element tag name.
	 * @returns Error object.
	 */
	protected _errorUnexpectedTagname(tagName: string) {
		return new Error(`Unexpected tagName: ${tagName}`);
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public abstract fromXmlElement(element: Readonly<IElement>): void;

	/**
	 * Encode Value to string.
	 *
	 * @param optioned Optioned object.
	 * @param depth Indent depth.
	 * @returns XML string.
	 */
	protected abstract _toXml(
		optioned: Readonly<IToXmlOptioned>,
		depth: number
	): string;
}
