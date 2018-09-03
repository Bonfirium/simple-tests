const chai = require('chai');
const chaiHttp = require('chai-http');

require('chai').should();
chai.use(chaiHttp);

const VALID_OBJECT_ID = '0000000000000000000000000';

const isError = (res, status) => {
	res.should.have.status(status);
	res.should.be.json;
	res.body.should.be.a('object');
	res.body.should.not.have.property('result');
	res.body.should.have.property('error');
};
const isSuccess = (res) => {
	res.should.have.status(200);
	res.should.be.json;
	res.body.should.be.a('object');
	res.body.should.have.property('result');
	res.body.should.not.have.property('error');
};

const checkStatus = (response, status) => {
	if (status === 200) isSuccess(response);
	else isError(response, status);
};

const useNotEmpty = (first, second) => {
	return first === undefined ? second : first;
};

const concatObjects = (first, second) => {
	return { ...first, ...second };
};

// todo refactor
const randomInt = (to, from = 0) => {
	let int = Math.floor(Math.random() * (from + to));
	if (int < from) int += from - int;
	if (int > to) int -= int - to;
	return int;
};

module.exports = {
	isSuccess, isError, checkStatus, useNotEmpty, concatObjects, randomInt,
};
