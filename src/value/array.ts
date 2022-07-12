import {IToXmlOptioned} from '../options';
import {IElement, xmlElementChildElements} from '../util';
import {Value} from '../value';

import {ValueBoolean} from './boolean';
import {ValueData} from './data';
import {ValueDate} from './date';
import {ValueDict} from './dict';
import {ValueInteger} from './integer';
import {ValueReal} from './real';
import {ValueString} from './string';

let getChildTagNamesCache: Map<string, new () => Value> | null = null;

/**
 * Get child tag names.
 *
 * @returns The map.
 */
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
	return getChildTagNamesCache;
};

/**
 * ValueArray object.
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

	/**
	 * ValueArray constructor.
	 *
	 * @param value The value.
	 */
	constructor(value: Value[] = []) {
		super();

		this.value = value;
	}

	/**
	 * Array length.
	 *
	 * @returns The length.
	 */
	public get length() {
		return this.value.length;
	}

	/**
	 * Get value at index or null if out of bounds.
	 *
	 * @param index Array index.
	 * @returns The value or null.
	 */
	public get(index: number) {
		const {value} = this;
		return index < this.length ? value[index] : null;
	}

	/**
	 * Get value at index or throw.
	 *
	 * @param index Array index.
	 * @returns The value.
	 */
	public getValue(index: number) {
		const r = this.get(index);
		if (!r) {
			throw new Error(`Index out of bounds: ${index}`);
		}
		return r;
	}

	/**
	 * Set value at index.
	 *
	 * @param index Array index.
	 * @param value Value object.
	 */
	public set(index: number, value: Value) {
		this.value[index] = value;
	}

	/**
	 * Push values onto array.
	 *
	 * @param values Value objects.
	 */
	public push(...values: Value[]) {
		this.value.push(...values);
	}

	/**
	 * Pop value off array or null.
	 *
	 * @returns Value object or null.
	 */
	public pop() {
		return this.value.pop() || null;
	}

	/**
	 * Pop value off array or throw.
	 *
	 * @returns Value object or null.
	 */
	public popValue() {
		const r = this.pop();
		if (!r) {
			throw new Error('Cannot pop empty array');
		}
		return r;
	}

	/**
	 * Shift value off array or null.
	 *
	 * @returns Value object or null.
	 */
	public shift() {
		return this.value.shift() || null;
	}

	/**
	 * Pop value off array or throw.
	 *
	 * @returns Value object or null.
	 */
	public shiftValue() {
		const r = this.shift();
		if (!r) {
			throw new Error('Cannot shift empty array');
		}
		return r;
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
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
	public childFromXmlElement(element: Readonly<IElement>) {
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
