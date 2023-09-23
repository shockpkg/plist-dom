import {INDENT_STRING, IToXmlOptions} from '../options';
import {IElement, assertXmlTagName, xmlElementText} from '../util';
import {Value} from '../value';

/**
 * ValueString object.
 */
export class ValueString extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'string';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['string'];

	/**
	 * Value value.
	 */
	public value = '';

	/**
	 * ValueString constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = '') {
		super();

		this.value = value;
	}

	/**
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'string');
		this.value = xmlElementText(element)?.nodeValue || '';
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		const e = this.value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');
		return `${p}<string>${e}</string>`;
	}
}
