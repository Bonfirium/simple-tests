const randomString = require('randomstring');

const TestParams = require('./class.TestParams.js');
const Messages = require('./class.Messages.js');
const { concatObjects, VALID_OBJECT_ID } = require('./utils');
const { executeFieldMultiTest, executeMultiTest, executeTest } = require('./common');

class TypeTests extends TestParams {

	constructor(params) {
		super(params);
		this.messages = new Messages({
			gte: (comparision) => `Must be greater than or equal to ${comparision}`,
			gt: (comparision) => `Must be greater than ${comparision}`,
			safeInteger: () => 'Is not a safe integer',
			objectId: () => 'Id has invalid format',
			boolean: () => 'Invalid boolean',
		});
	}

	safeInteger(field, { status = 400, expect = this.messages.get('safeInteger', field), send = {}} = {}) {
		describe(`safeInteger test`, () => {
			it('valid', async () => executeFieldMultiTest(...this._paramsArray, field, {
				status: 200,
				sendValues: [3, 3.0],
				defaultSend: send,
			}));
			it('invalid', async () => executeFieldMultiTest(...this._paramsArray, field, {
				status: 400,
				sendValues: ['3.5', 3.1],
				defaultSend: send,
				expect,
			}));
		});
	}

	gt(field, comparision, { status = 400, expect = this.messages.get('gt', field, comparision), send = {} } = {}) {
		it(`greater than ${comparision}`, () => executeMultiTest(...this._paramsArray, [
			{ status: 200, send: concatObjects(send, { [field]: comparision + 1}) },
			{ status: 400, expect, send: concatObjects(send, { [field]: comparision }) },
			{ status: 400, expect, send: concatObjects(send, { [field]: comparision - 1 }) },
		]))
	}

	gte(field, comparision, { status = 400, expect = this.messages.get('gte', field, comparision), send = {} } = {}) {
		it(`greater than or equal to ${comparision}`, () => executeMultiTest(...this._paramsArray, [
				{ status: 200, send: concatObjects(send, { [field]: comparision }) },
				{ status: 200, send: concatObjects(send, { [field]: comparision + 1 }) },
				{ status, expect, send: concatObjects(send, { [field]: comparision - 1 }) },
			],
		));
	}

	boolean(field, { status = 400, send = {}, expect = this.messages.get('boolean', field) } = {}) {
		describe('boolean test', () => {
			it('valid', () => executeFieldMultiTest(...this._paramsArray, field, {
				status: 200,
				sendValues: [true, 'true', false, 'false'],
			}));
			it('invalid', () => executeFieldMultiTest(...this._paramsArray, field, {
				status, expect,
				sendValues: [randomString.generate(3), randomString.generate(6)],
			}));
		});
	}

	objectId(field, { status = 400, send = {}, onlyInvalid = false, expect = this.messages.get('objectId', field) } = {}) {
		describe('objectId test', () => {
			it('invalid', () => executeTest(...this._paramsArray, {
				status: 400, expect,
				send: { ...send, [field]: randomString.generate(20) },
			}));

			if (onlyInvalid) return;
			it('valid', () => executeTest(...this._paramsArray, {
				status: 200,
				send: { ...send, [field]: VALID_OBJECT_ID },
			}));
		});
	}



}

module.exports = TypeTests;
