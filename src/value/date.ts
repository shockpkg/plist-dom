import {INDENT_STRING, IToXmlOptions} from '../options';
import {IElement, assertXmlTagName, xmlElementText} from '../util';
import {Value} from '../value';

/**
 * ValueDate object.
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

	/**
	 * ValueDate constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = new Date()) {
		super();

		this.value = value;
	}

	/**
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'date');
		const text = xmlElementText(element)?.nodeValue || '';
		const v = new Date(text);
		const time = v.getTime();
		if (!time && time !== 0) {
			throw new Error(`Invalid date data: ${text}`);
		}
		this.value = v;
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		const d = this.value.toISOString().replace(/\.\d+/, '');
		return `${p}<date>${d}</date>`;
	}
}
