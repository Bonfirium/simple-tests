class TestParams {
	constructor(params = {}) {
		this._params = {
			agent: null,
			method: null,
			path: null,
		};
		this.params = params;
	}

	set params(object) {
		['agent', 'method', 'path'].forEach((field) => {
			if (object[field] !== undefined) {
				this._params[field] = object[field];
			}
		});
	}

	set agent(agent) {
		this.params = { agent };
	}

	set method(method) {
		this.params = { method };
	}

	set path(path) {
		this.params = { path };
	}

	get _paramsArray() {
		return Object.values(this._params);
	}

}

module.exports = TestParams;
