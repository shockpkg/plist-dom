import {
	IToXmlOptioned,
	IToXmlOptions,
	toXmlOptionsOptioned
} from './options';
import {
	xmlDecode,
	xmlElementChildElements
} from './util';
import {
	Value
} from './value';
import {
	ValueArray
} from './values/array';

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
const xmlDoctype = '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';

/**
 * Plist constructor.
 */
export class Plist extends Object {
	/**
	 * Default XML declaration.
	 */
	public static readonly XML_DECLARATION = xmlDeclaration;

	/**
	 * Default XML doctype.
	 */
	public static readonly XML_DOCTYPE = xmlDoctype;

	/**
	 * XML declaration.
	 */
	public xmlDeclaration = xmlDeclaration;

	/**
	 * XML doctype.
	 */
	public xmlDoctype = xmlDoctype;

	/**
	 * If body is indented.
	 */
	public xmlIndented = false;

	/**
	 * Value element.
	 */
	public value: Value | null = null;

	constructor(value: Value | null = null) {
		super();

		this.value = value;
	}

	/**
	 * Encode documents to string.
	 *
	 * @return XML string.
	 */
	public toXml(options: IToXmlOptions | null = null) {
		return this._toXml(toXmlOptionsOptioned(options));
	}

	/**
	 * Decode document from string.
	 *
	 * @param xml XML string.
	 */
	public fromXml(xml: string) {
		const {
			declaration,
			doctype,
			documentElement
		} = xmlDecode(xml);
		this.fromXmlElement(documentElement, declaration, doctype);
	}

	/**
	 * Decode document from element.
	 *
	 * @param element XML element
	 * @param declaration XML declaration
	 * @param doctype XML doctype
	 */
	public fromXmlElement(
		element: Element,
		declaration: string | null = null,
		doctype: string | null = null
	) {
		const tagName = element.tagName;
		if (tagName !== 'plist') {
			throw new Error(`Unexpected root plist tag name: ${tagName}`);
		}

		const childElements = xmlElementChildElements(element);
		const childElementsL = childElements.length;
		if (childElementsL > 1) {
			throw new Error(`Multiple root plist child tag: ${childElementsL}`);
		}

		this.value = childElementsL ?
			this.childFromXmlElement(childElements[0]) : null;
		this.xmlDeclaration = declaration || '';
		this.xmlDoctype = doctype || '';
	}

	/**
	 * Decode child element from XML element.
	 *
	 * @param element XML element.
	 * @return Value element.
	 */
	public childFromXmlElement(element: Element) {
		const a = new ValueArray();
		return a.childFromXmlElement(element);
	}

	/**
	 * Encode documents to string.
	 *
	 * @return XML string.
	 */
	protected _toXml(optioned: IToXmlOptioned) {
		const v = this.value;
		const d = this.xmlIndented ? 1 : 0;
		return [
			...[this.xmlDeclaration, this.xmlDoctype].filter(Boolean),
			'<plist version="1.0">',
			...(v ? [v.toXml(optioned, d)] : []),
			'</plist>',
			''
		].join(optioned.newlineString);
	}
}
