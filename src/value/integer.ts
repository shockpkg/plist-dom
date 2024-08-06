import {INDENT_STRING, IToXmlOptions} from '../options.ts';
import {IElement, assertXmlTagName, xmlElementText} from '../util.ts';
import {Value} from '../value.ts';

const MAX_NUM = 0x1fffffffffffff;

/**
 * Assert number is integer.
 *
 * @param value Number value.
 */
function assertInteger(value: number | bigint) {
	if (typeof value === 'number' && !Number.isInteger(value)) {
		// eslint-disable-next-line unicorn/prefer-type-error
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
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'integer');
		const text = xmlElementText(element)?.nodeValue || '';
		if (!/^[+-]?\d+$/.test(text)) {
			throw new Error(`Invalid integer data: ${text}`);
		}
		const num = +text;
		this.value = num > MAX_NUM || num < -MAX_NUM ? BigInt(text) : num;
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		const v = this.value;
		assertInteger(v);
		return `${p}<integer>${v}</integer>`;
	}
}
