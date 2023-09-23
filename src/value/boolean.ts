import {INDENT_STRING, IToXmlOptions} from '../options';
import {
	IElement,
	assertNoXmlElementChildNodes,
	assertXmlTagName
} from '../util';
import {Value} from '../value';

/**
 * ValueBoolean object.
 */
export class ValueBoolean extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'boolean';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['true', 'false'];

	/**
	 * Value value.
	 */
	public value = false;

	/**
	 * ValueBoolean constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = false) {
		super();

		this.value = value;
	}

	/**
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertNoXmlElementChildNodes(element);
		switch (element.tagName) {
			case 'true': {
				this.value = true;
				return;
			}
			case 'false': {
				this.value = false;
				return;
			}
			default: {
				throw assertXmlTagName(element, '');
			}
		}
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		return this.value ? `${p}<true/>` : `${p}<false/>`;
	}
}
