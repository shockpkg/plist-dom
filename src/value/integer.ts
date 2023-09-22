import {IToXmlOptioned} from '../options';
import {IElement, decodeIntBase10} from '../util';
import {Value} from '../value';

/**
 * Assert number is integer.
 *
 * @param value Number value.
 */
function assertInteger(value: number | bigint) {
	if (typeof value === 'number' && !Number.isInteger(value)) {
		throw new Error(`Value not an integer: ${value}`);
	}
}

/**
 * ValueInteger object.
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
	public value: number | bigint = 0;

	/**
	 * ValueInteger constructor.
	 *
	 * @param value The value.
	 */
	constructor(value: number | bigint = 0) {
		super();

		assertInteger(value);
		this.value = value;
	}

	/**
	 * Get value as BigInt.
	 *
	 * @returns Value as a BigInt.
	 */
	public asBigInt() {
		return BigInt(this.value);
	}

	/**
	 * Get value as Number, possibly losing some precision.
	 *
	 * @returns Value as a Number.
	 */
	public asNumber() {
		return Number(this.value);
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		this._assertXmlTagname(element, 'integer');
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
		return `${p}<integer>${v}</integer>`;
	}
}
