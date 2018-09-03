const assert = require('assert');
const { checkStatus, useNotEmpty, concatObjects } = require('./utils');

/**
 * check response
 * @param response
 * @param {Number} status
 * @param {Object} expect
 */
function test(response, { status, expect } = {}) {
	checkStatus(response, status);
	const result = response.body[status === 200 ? 'result' : 'error'];
	if (expect !== undefined) {
		assert.deepStrictEqual(result, expect);
	}
}

/**
 * send data to the path and check response
 * @param agent
 * @param method
 * @param path
 * @param status
 * @param expect
 * @param send
 * @param strict
 * @returns {Promise<void>}
 */
async function executeTest(agent, method, path, { status, expect, send = {}, strict = true } = {}) {
	test(await agent[method](path).send(send), { status, expect, strict });
}

/**
 *
 * @param agent
 * @param method
 * @param path
 * @param {Array} tests Array of tests
 * @param {Object} defaults Default send object to concat if a field in a test is undefined
 * @returns {Promise<*>}
 */
async function executeMultiTest(agent, method, path, tests, defaults = {}) {
	return Promise.all(tests.map((test) => executeTest(agent, method, path, {
			status: useNotEmpty(test.status, defaults.status),
			send: useNotEmpty(test.send, defaults.send),
			expect: useNotEmpty(test.expect, defaults.expect),
		})
	));
}

/**
 * Multi send by field
 * @param agent
 * @param method
 * @param path
 * @param {String} field Field to send values
 * @param {Number} status Status to expect
 * @param {Object|undefined} expect Object to expect. If undefined passed response will not be checked
 * @param {Array} sendValues Values to send by test
 * @param {Object} defaultSend Default send object to concat with current sendValues
 * @returns {Promise<void[]>}
 */
async function executeFieldMultiTest(agent, method, path, field, { status, expect, sendValues = [], defaultSend = {} } = {}) {
	return Promise.all(sendValues.map((sendValue) =>
		executeTest(agent, method, path, {
			status,
			expect,
			send: concatObjects(defaultSend, { [field]: sendValue })
		})
	));
}

module.exports = {
	test, executeTest, executeMultiTest, executeFieldMultiTest,
};
