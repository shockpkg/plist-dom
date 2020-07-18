import {
	IToXmlOptioned
} from '../options';
import {
	IElement,
	xmlEntitiesEncode
} from '../util';
import {
	Value
} from '../value';

/**
 * ValueString constructor.
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

	constructor(value = '') {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: IElement) {
		this._assertXmlTagname(element, 'string');
		this.value = this._getXmlElementText(element) || '';
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
		return `${p}<string>${xmlEntitiesEncode(this.value)}</string>`;
	}
}
