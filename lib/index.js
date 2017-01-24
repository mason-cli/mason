'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CommandRunner = require('./cli/CommandRunner');

var _CommandRunner2 = _interopRequireDefault(_CommandRunner);

var _Builtins = require('./cli/Builtins');

var _Builtins2 = _interopRequireDefault(_Builtins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Mason = new _CommandRunner2.default();

(0, _Builtins2.default)(Mason);

exports.default = Mason;