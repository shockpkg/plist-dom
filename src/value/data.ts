import {
	DATA_COLUMNS,
	INDENT_STRING,
	IToXmlOptions,
	NEWLINE_STRING
} from '../options';
import {
	IElement,
	assertXmlTagName,
	base64Decode,
	base64Encode,
	stringChunk,
	xmlElementText
} from '../util';
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
	public value: Uint8Array;

	/**
	 * ValueData constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = new Uint8Array(0)) {
		super();

		this.value = value;
	}

	/**
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'data');
		const text = xmlElementText(element)?.nodeValue || '';
		this.value = base64Decode(text);
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
			for (const s of stringChunk(base64Encode(this.value), c)) {
				r.push(`${p}${s}`);
			}
		} else {
			r.push(`${p}${base64Encode(this.value)}`);
		}
		r.push(`${p}</data>`);
		return r.join(newlineString);
	}
}
