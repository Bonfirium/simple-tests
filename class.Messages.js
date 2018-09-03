class Messages {

	constructor(messages) {
		this._messages = messages;
	}

	get(field, key, ...params) {
		return { [key]: [this._messages[field](...params)] };
	}

}

module.exports = Messages;
