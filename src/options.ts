export interface IToXmlOptions {
	//
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

export interface IToXmlOptioned {
	//
	/**
	 * Indent string.
	 */
	indentString: string;

	/**
	 * Newline string.
	 */
	newlineString: string;

	/**
	 * Data columns, zero of negative for one row.
	 */
	dataColumns: number;

	/**
	 * Indent root element content.
	 */
	indentRoot: boolean;
}

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
		indentString: options.indentString ?? '\t',
		newlineString: options.newlineString ?? '\n',
		dataColumns: options.dataColumns ?? 68,
		indentRoot: options.indentRoot ?? false
	};
}
