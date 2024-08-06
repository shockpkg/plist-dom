import {INDENT_ROOT, IToXmlOptions, NEWLINE_STRING} from './options.ts';
import {IElement, xmlDecode, xmlElementChildElements} from './util.ts';
import {Value} from './value.ts';
import {ValueDict} from './value/dict.ts';

const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
const xmlDoctype =
	'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">';

/**
 * Plist object.
 */
export class Plist {
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
	 * Value element.
	 */
	public value: Value | null = null;

	/**
	 * Plist constructor.
	 *
	 * @param value The value.
	 */
	constructor(value: Value | null = null) {
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
	 * Decode document from string.
	 *
	 * @param xml XML string.
	 */
	public fromXml(xml: string) {
		const {declaration, doctype, documentElement} = xmlDecode(xml);
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
		element: Readonly<IElement>,
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

		this.value = childElementsL
			? this.childFromXmlElement(childElements[0])
			: null;
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
		const a = new ValueDict();
		return a.childFromXmlElement(element);
	}

	/**
	 * Encode documents to string.
	 *
	 * @param options Options object.
	 * @returns XML string.
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null) {
		const ir = options?.indentRoot ?? INDENT_ROOT;
		const n = options?.newlineString ?? NEWLINE_STRING;

		const v = this.value;
		return [
			...[this.xmlDeclaration, this.xmlDoctype].filter(Boolean),
			'<plist version="1.0">',
			...(v ? [v.toXml(options, ir ? 1 : 0)] : []),
			'</plist>',
			''
		].join(n);
	}
}
