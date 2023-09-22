import {
	DATA_COLUMNS,
	INDENT_STRING,
	IToXmlOptions,
	NEWLINE_STRING
} from '../options';
import {IElement, assertXmlTagName, stringChunk, xmlElementText} from '../util';
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
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'data');
		const b64 = xmlElementText(element)?.nodeValue || '';
		if (!/^[0-9a-z+/\s]*[=]?\s*[=]?\s*$/i.test(b64)) {
			throw new Error(`Invalid base64 data: ${b64}`);
		}
		this.value = Buffer.from(b64, 'base64');
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const indentString = options?.indentString ?? INDENT_STRING;
		const newlineString = options?.newlineString ?? NEWLINE_STRING;
		const c = options?.dataColumns ?? DATA_COLUMNS;
		const p = indentString.repeat(depth);
		const r = [`${p}<data>`];
		if (c > 0) {
			for (const s of stringChunk(this.value.toString('base64'), c)) {
				r.push(`${p}${s}`);
			}
		} else {
			r.push(`${p}${this.value.toString('base64')}`);
		}
		r.push(`${p}</data>`);
		return r.join(newlineString);
	}
}
