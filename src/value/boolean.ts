import {IToXmlOptioned} from '../options';
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
	 * Decode value from element.
	 *
	 * @param element XML element.
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
