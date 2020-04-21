import {
	IToXmlOptioned,
	IToXmlOptions,
	toXmlOptionsOptioned
} from './options';
import {
	IElement,
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
	 *
	 * @deprecated Use toXml IToXmlOptions option to indent the body.
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
	 * Get value or throw if null.
	 *
	 * @returns The value.
	 */
	public getValue() {
		const {value} = this;
		if (!value) {
			throw new Error('Value is null');
		}
		return value;
	}

	/**
	 * Cast to specific type or null.
	 *
	 * @param Type Type constructor.
	 * @returns The object or null.
	 */
	public valueCastTo<T extends typeof Value>(Type: T): T['prototype'] | null {
		const {value} = this;
		return value ? value.castTo(Type) : null;
	}

	/**
	 * Cast to specific type or throw.
	 *
	 * @param Type Type constructor.
	 * @returns The object.
	 */
	public valueCastAs<T extends typeof Value>(Type: T): T['prototype'] {
		const casted = this.valueCastTo(Type);
		if (!casted) {
			throw new Error(`Cannot cast value to type '${Type.TYPE}'`);
		}
		return casted;
	}

	/**
	 * Encode documents to string.
	 *
	 * @param options Encode options.
	 * @returns XML string.
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null) {
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
	 * @param element XML element.
	 * @param declaration XML declaration.
	 * @param doctype XML doctype.
	 */
	public fromXmlElement(
		element: IElement,
		declaration: string | null = null,
		doctype: string | null = null
	) {
		const {tagName} = element;
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
	 * @returns Value element.
	 */
	public childFromXmlElement(element: IElement) {
		const a = new ValueArray();
		return a.childFromXmlElement(element);
	}

	/**
	 * Encode documents to string.
	 *
	 * @param optioned Encode options.
	 * @returns XML string.
	 */
	protected _toXml(optioned: Readonly<IToXmlOptioned>) {
		const v = this.value;
		const d = (optioned.indentRoot || this.xmlIndented) ? 1 : 0;
		return [
			...[this.xmlDeclaration, this.xmlDoctype].filter(Boolean),
			'<plist version="1.0">',
			...(v ? [v.toXml(optioned, d)] : []),
			'</plist>',
			''
		].join(optioned.newlineString);
	}
}
