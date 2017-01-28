'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Mason command line input abstraction layer
 */
var Input = function () {
	/**
  * Build the input object and extract command line arguments
  * @param  {Number} skip The number of parameters to skip
  * @return {void}
  */
	function Input() {
		var _this = this;

		var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		_classCallCheck(this, Input);

		this._command = '';
		this._bin = false;
		this._file = false;
		this._args = [];
		this._flags = [];
		this._options = {};

		// Tokenize input
		process.argv.forEach(function (val, index, array) {
			if (index >= skip) {
				if (val.substr(0, 2) == '--' || val.substr(0, 1) == '-') {
					var arg = val.substr(2, val.length - 2);
					if (arg.indexOf('=') !== -1) {
						var parts = arg.split('=');
						_this._options[parts[0]] = parts[1];
					} else {
						_this._flags.push(arg);
					}
				} else {
					_this._args.push(val);
				}
			}
		});

		var a = this._args.shift();
		var n = false;
		if (a.indexOf('node') != -1) {
			n = true;
			this._bin = a;
			a = this._args.shift();
		}
		if (n) {
			this._file = a;
			a = this._args.shift();
		} else if (a.indexOf('mason') == 0) {
			this._bin = a;
			a = this._args.shift();
		}
		this._command = a;
	}

	/**
  * Get all arguments
  * @return {object} The arguments
  */


	_createClass(Input, [{
		key: 'arguments',
		value: function _arguments() {
			return this._args;
		}

		/**
   * Get the command name
   * @return {string} Command name
   */

	}, {
		key: 'command',
		value: function command() {
			return this._command;
		}

		/**
   * Get all flags
   * @return {object} Flags as an array
   */

	}, {
		key: 'flags',
		value: function flags() {
			return this._flags;
		}

		/**
   * Get all keyval options
   * @return {object} Keyval options object
   */

	}, {
		key: 'options',
		value: function options() {
			return this._options;
		}

		/**
   * Get all input
   * @return {object} All input
   */

	}, {
		key: 'all',
		value: function all() {
			return { args: this._args, flags: this._flags, options: this._options };
		}
	}]);

	return Input;
}();

exports.default = Input;