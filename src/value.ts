import {IToXmlOptions} from './options';
import {IElement, xmlDecode} from './util';

/**
 * Value object.
 */
export abstract class Value {
	/**
	 * Value type.
	 */
	public static readonly TYPE: string;

	/**
	 * Tag names.
	 */
	public static readonly TAG_NAMES: string[];

	/**
	 * Value constructor.
	 */
	constructor() {}

	/**
	 * Value type.
	 *
	 * @returns Type string.
	 */
	public get type() {
		return (this.constructor as typeof Value).TYPE;
	}

	/**
	 * Cast to specific type or null.
	 *
	 * @param Type Type constructor.
	 * @returns This object or null.
	 */
	public castTo<T extends typeof Value>(Type: T): T['prototype'] | null {
		return this.type === Type.TYPE ? this : null;
	}

	/**
	 * Cast to specific type or throw.
	 *
	 * @param Type Type constructor.
	 * @returns This object.
	 */
	public castAs<T extends typeof Value>(Type: T): T['prototype'] {
		const casted = this.castTo(Type);
		if (!casted) {
			throw new Error(
				`Cannot cast type '${this.type}' to '${Type.TYPE}'`
			);
		}
		return casted;
	}

	/**
	 * Decode document from string.
	 *
	 * @param xml XML string.
	 */
	public fromXml(xml: string) {
		const {documentElement} = xmlDecode(xml);
		this.fromXmlElement(documentElement);
	}

	/**
	 * Decode value from element.
	 *
	 * @param element XML element.
	 */
	public abstract fromXmlElement(element: Readonly<IElement>): void;

	/**
	 * Encode Value to string.
	 *
	 * @param options Options object.
	 * @param depth Indent depth.
	 * @returns Xml string.
	 */
	public abstract toXml(
		options?: Readonly<IToXmlOptions> | null,
		depth?: number
	): string;
}
