import {INDENT_STRING, NEWLINE_STRING, IToXmlOptions} from '../options';
import {IElement, assertXmlTagName, xmlElementChildElements} from '../util';
import {Value} from '../value';

import {ValueBoolean} from './boolean';
import {ValueData} from './data';
import {ValueDict} from './dict';
import {ValueInteger} from './integer';
import {ValueReal} from './real';
import {ValueString} from './string';

let childTagNames: Readonly<Map<string, new () => Value>>;

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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static get CHILD_TAG_NAMES() {
		if (!childTagNames) {
			childTagNames = new Map();
			for (const ValueType of [
				ValueArray,
				ValueBoolean,
				ValueData,
				ValueDict,
				ValueInteger,
				ValueReal,
				ValueString
			]) {
				for (const t of ValueType.TAG_NAMES) {
					childTagNames.set(t, ValueType);
				}
			}
		}
		return childTagNames;
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
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'array');
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
		const {tagName} = element;
		const {CHILD_TAG_NAMES} = this.constructor as typeof ValueArray;
		const Value = CHILD_TAG_NAMES.get(tagName) || null;
		if (!Value) {
			throw new Error(`Unknown element type: ${tagName}`);
		}
		const r = new Value();
		r.fromXmlElement(element);
		return r;
	}

	/**
	 * @inheritdoc
	 */
	public toXml(options: Readonly<IToXmlOptions> | null = null, depth = 0) {
		const n = options?.newlineString ?? NEWLINE_STRING;
		const p = (options?.indentString ?? INDENT_STRING).repeat(depth);
		const v = this.value;
		if (!v.length) {
			return `${p}<array/>`;
		}
		let r = `${p}<array>`;
		for (const el of v) {
			r += `${n}${el.toXml(options, depth + 1)}`;
		}
		r += `${n}${p}</array>`;
		return r;
	}
}
