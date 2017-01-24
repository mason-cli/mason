'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _Arguments = require('./cli/Arguments');

var _Arguments2 = _interopRequireDefault(_Arguments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
	var input = new _Arguments2.default();
	_index2.default.run(input.command(), input.all());
} catch (e) {
	console.error('Error: ' + e.message);
	console.log(e.stack);
}

_index2.default.finally(function () {
	console.log(' ');
});