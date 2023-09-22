/* eslint-disable max-nested-callbacks */
import {describe, it} from 'node:test';
import {strictEqual, throws} from 'node:assert';

import {ValueBoolean} from './boolean';

void describe('value/boolean', () => {
	void describe('ValueBoolean', () => {
		void describe('constructor', () => {
			void it('false', () => {
				const el = new ValueBoolean(false);
				strictEqual(el.value, false);
			});

			void it('true', () => {
				const el = new ValueBoolean(true);
				strictEqual(el.value, true);
			});
		});

		void describe('toXml', () => {
			void it('true', () => {
				const el = new ValueBoolean(true);
				strictEqual(el.toXml(), '<true/>');
				strictEqual(el.toXml(null, 1), '\t<true/>');
			});

			void it('false', () => {
				const el = new ValueBoolean(false);
				strictEqual(el.toXml(), '<false/>');
				strictEqual(el.toXml(null, 1), '\t<false/>');
			});
		});

		void describe('fromXml', () => {
			void it('true', () => {
				const el = new ValueBoolean(false);
				el.fromXml('<true/>');
				strictEqual(el.value, true);
				el.value = false;
				el.fromXml('<true></true>');
				strictEqual(el.value, true);
			});

			void it('false', () => {
				const el = new ValueBoolean(true);
				el.fromXml('<false/>');
				strictEqual(el.value, false);
				el.value = true;
				el.fromXml('<false></false>');
				strictEqual(el.value, false);
			});

			void it('children', () => {
				const el = new ValueBoolean(false);
				throws(() => {
					el.fromXml('<true>a</true>');
				});
				throws(() => {
					el.fromXml('<true><a/></true>');
				});
			});

			void it('badtag', () => {
				const el = new ValueBoolean(false);
				throws(() => {
					el.fromXml('<bad/>');
				});
				throws(() => {
					el.fromXml('<bad></bad>');
				});
			});
		});
	});
});
