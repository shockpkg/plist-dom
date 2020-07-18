import {
	IToXmlOptioned
} from '../options';
import {
	IElement
} from '../util';
import {
	Value
} from '../value';

/**
 * ValueDate constructor.
 */
export class ValueDate extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'date';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['date'];

	/**
	 * Value value.
	 */
	public value = new Date();

	constructor(value = new Date()) {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		this._assertXmlTagname(element, 'date');
		const text = this._getXmlElementText(element) || '';
		const v = new Date(text);
		const time = v.getTime();
		if (!time && time !== 0) {
			throw new Error(`Invalid date data: ${text}`);
		}
		this.value = v;
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
		const d = this.value.toISOString().replace(/\.\d+/, '');
		return `${p}<date>${d}</date>`;
	}
}
