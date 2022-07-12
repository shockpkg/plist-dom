/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import {IToXmlOptioned} from './options';
import {IElement} from './util';
import {Value} from './value';

class ValueA extends Value {
	public static readonly TYPE = 'ValueA';

	constructor() {
		super();
	}

	public fromXmlElement(element: Readonly<IElement>): void {
		throw new Error('Not implemented.');
	}

	protected _toXml(
		optioned: Readonly<IToXmlOptioned>,
		depth: number
	): string {
		throw new Error('Not implemented.');
	}
}

class ValueB extends Value {
	public static readonly TYPE = 'ValueB';

	constructor() {
		super();
	}

	public fromXmlElement(element: Readonly<IElement>): void {
		throw new Error('Not implemented.');
	}

	protected _toXml(
		optioned: Readonly<IToXmlOptioned>,
		depth: number
	): string {
		throw new Error('Not implemented.');
	}
}

describe('value', () => {
	describe('Value', () => {
		describe('castTo', () => {
			it('same type', () => {
				const value = new ValueA();
				expect(value.castTo(ValueA)).toBeTruthy();
			});

			it('different type', () => {
				const value = new ValueA();
				expect(value.castTo(ValueB)).toBeNull();
			});
		});

		describe('castAs', () => {
			it('same type', () => {
				const value = new ValueA();
				expect(value.castAs(ValueA)).toBeTruthy();
			});

			it('different type', () => {
				const value = new ValueA();
				expect(() => value.castAs(ValueB)).toThrow();
			});
		});
	});
});
