import {defaultValue} from './util';

export interface IToXmlOptions {
	//
	/**
	 * Indent string.
	 *
	 * @default '\t'
	 */
	indentString?: string;

	/**
	 * Newline string.
	 *
	 * @default '\n'
	 */
	newlineString?: string;

	/**
	 * Data columns, zero of negative for one row.
	 *
	 * @default 68
	 */
	dataColumns?: number;

	/**
	 * Indent root element content.
	 *
	 * @default false
	 */
	indentRoot?: boolean;
}

export type IToXmlOptioned = Required<IToXmlOptions>;

/**
 * Convert IToXmlOptions to IToXmlOptioned with defaults.
 *
 * @param options Options object.
 * @returns Optioned object.
 */
export function toXmlOptionsOptioned(
	options: Readonly<IToXmlOptions> | null = null
): IToXmlOptioned {
	options = options || {};
	return {
		indentString: defaultValue(options.indentString, '\t'),
		newlineString: defaultValue(options.newlineString, '\n'),
		dataColumns: defaultValue(options.dataColumns, 68),
		indentRoot: defaultValue(options.indentRoot, false)
	};
}
