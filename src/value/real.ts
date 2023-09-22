import {IToXmlOptioned} from '../options';
import {IElement} from '../util';
import {Value} from '../value';

/**
 * ValueReal object.
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

	/**
	 * ValueReal constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = 0) {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		this._assertXmlTagname(element, 'real');
		const text = this._getXmlElementText(element) || '';
		if (!/^[-+]?([0-9]+|[0-9]*\.[0-9]+)$/.test(text)) {
			throw new Error(`Invalid real data: ${text}`);
		}
		this.value = +text;
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
		return `${p}<real>${v}</real>`;
	}
}
