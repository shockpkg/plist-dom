import {
	IToXmlOptioned
} from '../options';
import {
	Value
} from '../value';

/**
 * ValueBoolean constructor.
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

	constructor(value = false) {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Element) {
		this._assertNoXmlElementChildNodes(element);
		const {tagName} = element;
		if (tagName === 'true') {
			this.value = true;
			return;
		}
		if (tagName === 'false') {
			this.value = false;
			return;
		}
		throw this._errorUnexpectedTagname(tagName);
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
		return this.value ? `${p}<true/>` : `${p}<false/>`;
	}
}
