export const INDENT_STRING = '\t';
export const NEWLINE_STRING = '\n';
export const DATA_COLUMNS = 68;
export const INDENT_ROOT = false;

export interface IToXmlOptions {
	/**
	 * Indent string.
	 *
	 * @default '\t'
	 */
	indentString?: string | null;

	/**
	 * Newline string.
	 *
	 * @default '\n'
	 */
	newlineString?: string | null;

	/**
	 * Data columns, zero of negative for one row.
	 *
	 * @default 68
	 */
	dataColumns?: number | null;

	/**
	 * Indent root element content.
	 *
	 * @default false
	 */
	indentRoot?: boolean | null;
}
