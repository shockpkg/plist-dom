import {INDENT_STRING, NEWLINE_STRING, IToXmlOptions} from '../options.ts';
import {
	IElement,
	assertXmlTagName,
	xmlElementChildElements,
	xmlElementText
} from '../util.ts';
import {Value} from '../value.ts';

import {ValueArray} from './array.ts';
import {ValueBoolean} from './boolean.ts';
import {ValueData} from './data.ts';
import {ValueInteger} from './integer.ts';
import {ValueReal} from './real.ts';
import {ValueString} from './string.ts';

let childTagNames: Readonly<Map<string, new () => Value>>;

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
	 * @inheritdoc
	 */
	public fromXmlElement(element: Readonly<IElement>) {
		assertXmlTagName(element, 'dict');
		const children = xmlElementChildElements(element);
		const l = children.length;
		if (l % 2) {
			throw new Error(`Uneven number of child elements: ${l}`);
		}
		const v: Map<string, Value> = new Map();
		for (let i = 0; i < l; i += 2) {
			const eK = children[i];
			const eV = children[i + 1];
			assertXmlTagName(eK, 'key');
			const key = xmlElementText(eK)?.nodeValue || '';
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
		const {tagName} = element;
		const {CHILD_TAG_NAMES} = this.constructor as typeof ValueDict;
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
		const i = options?.indentString ?? INDENT_STRING;
		const n = options?.newlineString ?? NEWLINE_STRING;
		const p = i.repeat(depth);
		const v = this.value;
		if (!v.size) {
			return `${p}<dict/>`;
		}
		const p2 = i.repeat(depth + 1);
		let r = `${p}<dict>`;
		for (const [key, val] of v) {
			const e = key
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;');
			r += `${n}${p2}<key>${e}</key>${n}${val.toXml(options, depth + 1)}`;
		}
		r += `${n}${p}</dict>`;
		return r;
	}
}
