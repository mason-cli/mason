'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _Command = require('./Command');

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandRunner = function () {
	function CommandRunner() {
		_classCallCheck(this, CommandRunner);

		this.commands = new Map();
		this.promises = [];
	}

	_createClass(CommandRunner, [{
		key: 'registerCommand',
		value: function registerCommand(name, runner) {
			if (runner.prototype instanceof _Command2.default) {
				this.commands.set(name, runner);
			} else {
				throw { message: "Invalid command object registered: " + name };
			}
		}
	}, {
		key: 'getCommand',
		value: function getCommand(name) {
			if (this.commands.has(name)) {
				return this.commands.get(name);
			}

			throw { message: "Command not found" + (name ? ": '" + name + "'" : "") };
		}
	}, {
		key: 'run',
		value: function run(cmd, options) {
			var obj = this.getCommand(cmd);
			var command = new obj(options);
			if (command) {
				var execution = new _es6Promise2.default(command.run);
				this.promises.push(execution);
				return execution;
			}
			return false;
		}
	}, {
		key: 'finally',
		value: function _finally(then, err) {
			return _es6Promise2.default.all(this.promises).then(then).catch(err);
		}
	}]);

	return CommandRunner;
}();

exports.default = CommandRunner;