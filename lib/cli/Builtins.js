'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Command3 = require('./Command');

var _Command4 = _interopRequireDefault(_Command3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Mason) {
	var VersionCommand = function (_Command) {
		_inherits(VersionCommand, _Command);

		function VersionCommand() {
			_classCallCheck(this, VersionCommand);

			return _possibleConstructorReturn(this, (VersionCommand.__proto__ || Object.getPrototypeOf(VersionCommand)).apply(this, arguments));
		}

		_createClass(VersionCommand, [{
			key: 'run',
			value: function run(resolve, reject) {
				console.log('Mason version 1.0.0');
				resolve();
			}
		}, {
			key: 'description',
			get: function get() {
				return 'Displays the current Mason build version';
			}
		}]);

		return VersionCommand;
	}(_Command4.default);

	var HelpCommand = function (_Command2) {
		_inherits(HelpCommand, _Command2);

		function HelpCommand() {
			_classCallCheck(this, HelpCommand);

			return _possibleConstructorReturn(this, (HelpCommand.__proto__ || Object.getPrototypeOf(HelpCommand)).apply(this, arguments));
		}

		_createClass(HelpCommand, [{
			key: 'run',
			value: function run(resolve, reject) {
				console.log('Mason - Available Commands');
				console.log('---------------------------');
				this.runner.commands.forEach(function (name, cmd) {
					console.log(name + ': ' + (cmd.description || '(no description provided)'));
				});
				console.log('---------------------------');
				resolve();
			}
		}, {
			key: 'description',
			get: function get() {
				return 'Displays this help text';
			}
		}]);

		return HelpCommand;
	}(_Command4.default);

	Mason.registerCommand('help', HelpCommand);
	Mason.registerCommand('version', VersionCommand);
};