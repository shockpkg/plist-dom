/* eslint-disable max-nested-callbacks */
/* eslint-disable max-classes-per-file */
import {describe, it} from 'node:test';
import {ok, strictEqual, throws} from 'node:assert';

import {IToXmlOptions} from './options';
import {IElement} from './util';
import {Value} from './value';

class ValueA extends Value {
	public static readonly TYPE = 'ValueA';

	constructor() {
		super();
	}

	public fromXmlElement(element: Readonly<IElement>): void {
		throw new Error('Not implemented');
	}

	public toXml(
		options?: Readonly<IToXmlOptions> | null,
		depth?: number | undefined
	): string {
		throw new Error('Not implemented');
	}
}

class ValueB extends Value {
	public static readonly TYPE = 'ValueB';

	constructor() {
		super();
	}

	public fromXmlElement(element: Readonly<IElement>): void {
		throw new Error('Not implemented');
	}

	public toXml(
		options?: Readonly<IToXmlOptions> | null,
		depth?: number | undefined
	): string {
		throw new Error('Not implemented');
	}
}

void describe('value', () => {
	void describe('Value', () => {
		void describe('castTo', () => {
			void it('same type', () => {
				const value = new ValueA();
				ok(value.castTo(ValueA));
			});

			void it('different type', () => {
				const value = new ValueA();
				strictEqual(value.castTo(ValueB), null);
			});
		});

		void describe('castAs', () => {
			void it('same type', () => {
				const value = new ValueA();
				ok(value.castAs(ValueA));
			});

			void it('different type', () => {
				const value = new ValueA();
				throws(() => value.castAs(ValueB));
			});
		});
	});
});
