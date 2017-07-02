"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require("es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _Command = require("./Command");

var _Command2 = _interopRequireDefault(_Command);

var _MethodCommand = require("./MethodCommand");

var _MethodCommand2 = _interopRequireDefault(_MethodCommand);

var _promptSync = require("prompt-sync");

var _promptSync2 = _interopRequireDefault(_promptSync);

var _child_process2 = require("child_process");

var _child_process3 = _interopRequireDefault(_child_process2);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _prompt = new _promptSync2.default();

/**
 * Mason command line application class
 */
var Application = function () {
	/**
  * Build a new Mason application
  * @param  {object} config The configuration object
  * @return {void}
  */
	function Application() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Application);

		this.config = config;
		this.commands = new Map();
		this.events = new Map();
		this.data = new Map();
		this.promises = [];
	}

	/**
  * Get the current Mason version
  * @return {string} version descriptor
  */


	_createClass(Application, [{
		key: "version",
		value: function version() {
			return "0.1.1";
		}

		/**
   * Compare Mason version to an external version
   * @param  {string} a External version
   * @return {int}   1 if external is higher, -1 if Mason is higher, 0 otherwise
   */

	}, {
		key: "compareVersion",
		value: function compareVersion(a) {
			var b = this.version();

			if (a === b) {
				return 0;
			}

			var a_parts = a.split(".");
			var b_parts = b.split(".");

			var len = Math.min(a_parts.length, b_parts.length);

			for (var i = 0; i < len; i++) {
				if (parseInt(a_parts[i]) > parseInt(b_parts[i])) {
					return 1;
				} else if (parseInt(a_parts[i]) < parseInt(b_parts[i])) {
					return -1;
				}
			}

			if (a_parts.length > b_parts.length) {
				return 1;
			}

			if (a_parts.length < b_parts.length) {
				return -1;
			}

			return 0;
		}

		/**
   * Register a command with the Mason application
   * @param  {string} name   The command name
   * @param  {Command} runner The Command class to register
   * @return {void}
   */

	}, {
		key: "registerCommand",
		value: function registerCommand(name, runner) {
			// if(runner.prototype instanceof Command) { // TODO: Why doesn't this work?
			if (typeof runner == "function") {
				this.commands.set(name, runner);
			} else {
				throw "Invalid command object registered: " + name;
			}
		}

		/**
   * Get a command class by name
   * @param  {string} name 		The name of the command
   * @param  {bool} gracefully 	Whether or not to fail gracefully
   *
   * @return {Command}      		The command class
   */

	}, {
		key: "getCommand",
		value: function getCommand(name, gracefully) {
			if (this.commands.has(name)) {
				return this.commands.get(name);
			}

			if (gracefully) {
				return false;
			} else {
				throw "Command not found" + (name ? ": '" + name + "'" : "");
			}
		}

		/**
   * Register an event callback
   * @param  {string}   event    The name of the event
   * @param  {Function} callback The function to register
   * @return {number}            The index of the callback method
   */

	}, {
		key: "on",
		value: function on(event, callback) {
			if (!this.events.has(event)) {
				this.events.set(event, []);
			}
			var callbacks = this.events.get(event);
			var callbackIndex = callbacks.length;
			callbacks.push(callback);

			return callbackIndex;
		}

		/**
   * Cancel a registered event callback
   * @param  {string} event The name of the event
   * @param  {number} index The index of the event callback
   * @return {void}
   */

	}, {
		key: "cancel",
		value: function cancel(event, index) {
			if (this.events.has(event)) {
				var events = this.events.get(event);
				if (events[index]) {
					events[index] = false;
				}
			}
		}

		/**
   * Emit an event
   * @param  {string} event The name of the event
   * @param  {Object} props The properties to pass to registered callbacks
   * @return {void}
   */

	}, {
		key: "emit",
		value: function emit(event) {
			var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var continuing = true;
			this.events.get(event).forEach(function (callback) {
				if (continuing && typeof callback == "function") {
					continuing = !!callback(props);
				}
			});
		}

		/**
   * Reset all data when existing promises are fulfilled (SAFE)
   * @return {void}
   */

	}, {
		key: "reset",
		value: function reset() {
			this.finally(this.resetNow, this.resetNow);
		}

		/**
   * Reset all data now, including existing promises (UNSAFE)
   * @return {[type]} [description]
   */

	}, {
		key: "resetNow",
		value: function resetNow() {
			delete this.commands;
			delete this.data;
			delete this.events;
			delete this.promises;
			this.commands = new Map();
			this.events = new Map();
			this.data = new Map();
			this.promises = [];
		}

		/**
   * Run a command
   * @param  {string} cmd     The command name
   * @param  {object} options The command properties
   * @return {mixed}			The command execution promise
   */

	}, {
		key: "run",
		value: function run(cmd, options) {
			try {
				var obj = this.getCommand(cmd);
				var command = false;

				try {
					if (obj.prototype && obj.prototype.hasOwnProperty("run")) {
						command = new obj(options, this.config, this);
					} else {
						command = new _MethodCommand2.default(obj, options, this.config, this);
					}
				} catch (e) {
					console.info(e);
					throw "Invalid command object registered for " + cmd;
				}

				if (command) {
					var execution = new _es6Promise2.default(command.run);
					this.promises.push(execution);
					return execution;
				}
				throw "Invalid command requested: " + cmd;
			} catch (e) {
				console.error("Error! ", e.message ? e.message : e);
				if (e.stack) {
					console.log(_util2.default.inspect(e.stack, false, null));
				}
			}
		}

		/**
   * Prompt the user for input
   * @param  {string} query The query to which the user will respond
   * @return {string}       The user's response to the query
   */

	}, {
		key: "prompt",
		value: function prompt(query) {
			if (!process.stdin.setRawMode) {
				throw "Invalid prompt. If using Cygwin/Babun on Windows, try running with CMD.";
			}

			return _prompt(query);
		}

		/**
   * Spawn a new process
   * @param  {string} command The command to execute
   * @param  {array} args    arguments
   * @param  {object} options options
   * @return {mixed}         result of child_process.spawn
   */

	}, {
		key: "spawn",
		value: function spawn(command, args, options) {
			return _child_process3.default.spawn(command, args, options);
		}

		/**
   * Fork a new module
   * @param  {string} module  The module to fork
   * @param  {array} args    arguments
   * @param  {object} options options
   * @return {mixed}         result of child_process.fork
   */

	}, {
		key: "fork",
		value: function fork(module, args, options) {
			return _child_process3.default.fork(module, args, options);
		}

		/**
   * Execute a command in a new prompt
   * @param  {string} command The command to execute
   * @param  {array} args    arguments
   * @param  {object} options options
   * @return {mixed}         result of child_process.exec
   */

	}, {
		key: "exec",
		value: function exec(command, args, options) {
			return _child_process3.default.exec(command, args, options);
		}

		/**
   * A shortcut to retrieve child_process without requiring it elsewhere
   * @return {mixed} child_process
   */

	}, {
		key: "child_process",
		value: function child_process() {
			return _child_process3.default;
		}

		/**
   * Set the configuration options for Mason
   * @param {object} config The configuration object
   */

	}, {
		key: "setConfig",
		value: function setConfig(config) {
			this.config = config;
		}

		/**
   * The conclusion of all registered promises
   * @param  {function} then 	The function to execute if all promises resolve
   * @param  {function} err  	The function to execute if one or more promises rejected
   * @return {Promise}		A promise containing all other promises
   */

	}, {
		key: "finally",
		value: function _finally(then, err) {
			return _es6Promise2.default.all(this.promises).then(then).catch(err);
		}
	}]);

	return Application;
}();

exports.default = Application;