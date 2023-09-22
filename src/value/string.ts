import {IToXmlOptioned} from '../options';
import {IElement, assertXmlTagName, xmlElementText} from '../util';
import {Value} from '../value';

/**
 * ValueString object.
 */
export class ValueString extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'string';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['string'];

	/**
	 * Value value.
	 */
	public value = '';

	/**
	 * ValueString constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = '') {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'string');
		this.value = xmlElementText(element)?.nodeValue || '';
	}

	/**
	 * Encode element to string.
	 *
	 * @param optioned Optioned object.
	 * @param depth Indent depth.
	 * @returns XML string.
	 */
	protected _toXml(optioned: Readonly<IToXmlOptioned>, depth: number) {
		const p = optioned.indentString.repeat(depth);
		const e = this.value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');
		return `${p}<string>${e}</string>`;
	}
}
