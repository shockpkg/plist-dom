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
		const n = options?.newlineString ?? NEWLINE_STRING;
		const c = options?.dataColumns ?? DATA_COLUMNS;
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		let r = `${p}<data>`;
		if (c > 0) {
			for (let s = base64Encode(this.value); s; s = s.substring(c)) {
				r += `${n}${p}${s.substring(0, c)}`;
			}
		} else {
			r += `${n}${p}${base64Encode(this.value)}`;
		}
		r += `${n}${p}</data>`;
		return r;
	}
}
