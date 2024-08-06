import {INDENT_STRING, IToXmlOptions} from '../options.ts';
import {IElement, assertXmlTagName, xmlElementText} from '../util.ts';
import {Value} from '../value.ts';

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
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'real');
		const text = xmlElementText(element)?.nodeValue || '';
		if (!/^[+-]?(\d+|\d*\.\d+)$/.test(text)) {
			throw new Error(`Invalid real data: ${text}`);
		}
		this.value = +text;
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		const v = this.value;
		return `${p}<real>${v}</real>`;
	}
}
