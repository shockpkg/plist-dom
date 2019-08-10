import {
	defaultValue
} from './util';

export interface IToXmlOptions {

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
	 * Data columns.
	 *
	 * @default 68
	 */
	dataColumns?: number;
}

export interface IToXmlOptioned {

	/**
	 * Indent string.
	 *
	 * @default '\t'
	 */
	indentString: string;

	/**
	 * Newline string.
	 *
	 * @default '\n'
	 */
	newlineString: string;

	/**
	 * Data columns.
	 *
	 * @default 68
	 */
	dataColumns: number;
}

/**
 * Convert IToXmlOptions to IToXmlOptioned with defaults.
 *
 * @param options Options object.
 * @returns Optioned object.
 */
export function toXmlOptionsOptioned(
	options: IToXmlOptions | null = null
): IToXmlOptioned {
	options = options || {};
	return {
		indentString: defaultValue(options.indentString, '\t'),
		newlineString: defaultValue(options.newlineString, '\n'),
		dataColumns: defaultValue(options.dataColumns, 68)
	};
}
