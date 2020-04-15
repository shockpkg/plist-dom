import {
	IToXmlOptioned
} from '../options';
import {
	xmlElementChildElements
} from '../util';
import {
	Value
} from '../value';

import {ValueBoolean} from './boolean';
import {ValueData} from './data';
import {ValueDate} from './date';
import {ValueDict} from './dict';
import {ValueInteger} from './integer';
import {ValueReal} from './real';
import {ValueString} from './string';

let getChildTagNamesCache: any = null;
const getChildTagNames = () => {
	if (!getChildTagNamesCache) {
		getChildTagNamesCache = new Map();
		for (const Value of [
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			ValueArray,
			ValueBoolean,
			ValueData,
			ValueDate,
			ValueDict,
			ValueInteger,
			ValueReal,
			ValueString
		]) {
			for (const t of Value.TAG_NAMES) {
				getChildTagNamesCache.set(t, Value);
			}
		}
	}
	return getChildTagNamesCache as Map<string, new() => Value>;
};

/**
 * ValueArray constructor.
 */
export class ValueArray extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'array';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['array'];

	/**
	 * Child tag names.
	 *
	 * @returns Child tag names map.
	 */
	public static get CHILD_TAG_NAMES() {
		return getChildTagNames();
	}

	/**
	 * Child types.
	 *
	 * @returns Child tag names map.
	 */
	public get childTagNames() {
		return (this.constructor as typeof ValueArray).CHILD_TAG_NAMES;
	}

	/**
	 * Value value.
	 */
	public value: Value[] = [];

	constructor(value: Value[] = []) {
		super();

		this.value = value;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Element) {
		this._assertXmlTagname(element, 'array');
		const children = xmlElementChildElements(element);
		this.value = children.map(el => this.childFromXmlElement(el));
	}

	/**
	 * Decode child element from XML element.
	 *
	 * @param element XML element.
	 * @returns Value element.
	 */
	public childFromXmlElement(element: Element) {
		const type = element.tagName;
		const Value = this.childTagNames.get(type) || null;
		if (!Value) {
			throw new Error(`Unknown element type: ${type}`);
		}
		const r = new Value();
		r.fromXmlElement(element);
		return r;
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
		const v = this.value;
		if (!v.length) {
			return `${p}<array/>`;
		}
		const r = [`${p}<array>`];
		for (const el of v) {
			r.push(el.toXml(optioned, depth + 1));
		}
		r.push(`${p}</array>`);
		return r.join(optioned.newlineString);
	}
}
