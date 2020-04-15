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
 * ValueReal constructor.
 */
export class ValueReal extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'real';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['real'];

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
	 * @param element XML element.
	 */
	public fromXmlElement(element: Element) {
		this._assertXmlTagname(element, 'real');
		this.value = decodeIntBase10(this._getXmlElementText(element) || '');
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
		const v = this.value;
		assertInteger(v);
		return `${p}<real>${v}</real>`;
	}
}
