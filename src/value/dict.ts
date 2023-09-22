import {IToXmlOptioned} from '../options';
import {IElement, xmlElementChildElements} from '../util';
import {Value} from '../value';

import {ValueArray} from './array';
import {ValueBoolean} from './boolean';
import {ValueData} from './data';
import {ValueDate} from './date';
import {ValueInteger} from './integer';
import {ValueReal} from './real';
import {ValueString} from './string';

let childTagNames: Map<string, new () => Value>;

/**
 * ValueDict object.
 */
export class ValueDict extends Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE = 'dict';

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES = ['dict'];

	/**
	 * Child tag names.
	 *
	 * @returns Child tag names map.
	 */
	public static get CHILD_TAG_NAMES() {
		if (!childTagNames) {
			childTagNames = new Map();
			for (const Value of [
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
					childTagNames.set(t, Value);
				}
			}
		}
		return childTagNames;
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
	public value = new Map<string, Value>();

	/**
	 * ValueDict constructor.
	 *
	 * @param value The value.
	 */
	constructor(value = new Map<string, Value>()) {
		super();

		this.value = value;
	}

	/**
	 * Dictionary size.
	 *
	 * @returns The size.
	 */
	public get size() {
		return this.value.size;
	}

	/**
	 * Check if key exists.
	 *
	 * @param key Dictionary key.
	 * @returns The value or null.
	 */
	public has(key: string) {
		return this.value.has(key);
	}

	/**
	 * Get value for key or null if does not exist.
	 *
	 * @param key Dictionary key.
	 * @returns The value or null.
	 */
	public get(key: string) {
		return this.value.get(key) || null;
	}

	/**
	 * Get value for key or throw.
	 *
	 * @param key Dictionary key.
	 * @returns The value.
	 */
	public getValue(key: string) {
		const r = this.get(key);
		if (!r) {
			throw new Error(`Key is null: ${key}`);
		}
		return r;
	}

	/**
	 * Set value for key.
	 *
	 * @param key Dictionary key.
	 * @param value Value object.
	 */
	public set(key: string, value: Value) {
		this.value.set(key, value);
	}

	/**
	 * Delete value for key.
	 *
	 * @param key Dictionary key.
	 */
	public delete(key: string) {
		this.value.delete(key);
	}

	/**
	 * Clear dictionary.
	 */
	public clear() {
		this.value.clear();
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		this._assertXmlTagname(element, 'dict');
		const children = xmlElementChildElements(element);
		const l = children.length;
		if (l % 2) {
			throw new Error(`Uneven number of child elements: ${l}`);
		}
		const v: Map<string, Value> = new Map();
		for (let i = 0; i < l; i += 2) {
			const eK = children[i];
			const eV = children[i + 1];
			this._assertXmlTagname(eK, 'key');
			const key = this._getXmlElementText(eK) || '';
			const value = this.childFromXmlElement(eV);
			v.set(key, value);
		}
		this.value = v;
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
		if (!v.size) {
			return `${p}<dict/>`;
		}
		const p2 = optioned.indentString.repeat(depth + 1);
		const r = [`${p}<dict>`];
		for (const [key, val] of v) {
			const e = key
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;');
			r.push(`${p2}<key>${e}</key>`, val.toXml(optioned, depth + 1));
		}
		r.push(`${p}</dict>`);
		return r.join(optioned.newlineString);
	}
}
