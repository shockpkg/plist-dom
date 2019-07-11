import {
	IToXmlOptioned
} from '../options';
import {
	assertInteger,
	decodeIntBase10
} from '../util';
import {
	Value
} from '../value';

/**
 * ValueInteger constructor.
 */
export class ValueInteger extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'integer';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['integer'];

	/**
	 * Value value.
	 */
	public value = 0;

	constructor(value = 0) {
		super();

		assertInteger(value);
		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element
	 */
	public fromXmlElement(element: Element) {
		this._assertXmlTagname(element, 'integer');
		this.value = decodeIntBase10(this._getXmlElementText(element) || '');
	}

	/**
	 * Encode element to string.
	 *
	 * @param optioned Optioned object.
	 * @param depth Indent depth.
	 * @return XML string.
	 */
	protected _toXml(optioned: IToXmlOptioned, depth: number) {
		const p = optioned.indentString.repeat(depth);
		const v = this.value;
		assertInteger(v);
		return `${p}<integer>${v}</integer>`;
	}
}
