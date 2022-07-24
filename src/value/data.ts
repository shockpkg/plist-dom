import {IToXmlOptioned} from '../options';
import {IElement, stringChunk} from '../util';
import {Value} from '../value';

/**
 * ValueData object.
 */
export class ValueData extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'data';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['data'];

	/**
	 * Value value.
	 */
	public value = Buffer.alloc(0);

	/**
	 * ValueData constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = Buffer.alloc(0)) {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		this._assertXmlTagname(element, 'data');
		const b64 = this._getXmlElementText(element) || '';
		if (!/^[0-9a-z+/\s]*[=]?\s*[=]?\s*$/i.test(b64)) {
			throw new Error(`Invalid base64 data: ${b64}`);
		}
		this.value = Buffer.from(b64, 'base64');
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
		const r = [`${p}<data>`];
		const c = optioned.dataColumns;
		if (c > 0) {
			for (const s of stringChunk(this.value.toString('base64'), c)) {
				r.push(`${p}${s}`);
			}
		} else {
			r.push(`${p}${this.value.toString('base64')}`);
		}
		r.push(`${p}</data>`);
		return r.join(optioned.newlineString);
	}
}
