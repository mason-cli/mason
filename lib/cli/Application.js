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

/**
 * Mason command line application class
 */
var Application = function () {
	/**
  * Build a new Mason application
  * @param  {object} config The configuration object
  * @return {void}
  */
	function Application(config) {
		_classCallCheck(this, Application);

		this.config = config;
		this.commands = new Map();
		this.events = new Map();
		this.data = new Map();
		this.promises = [];
	}

	/**
  * Register a command with the Mason application
  * @param  {string} name   The command name
  * @param  {Command} runner The Command class to register
  * @return {void}
  */


	_createClass(Application, [{
		key: 'registerCommand',
		value: function registerCommand(name, runner) {
			if (runner.prototype instanceof _Command2.default) {
				this.commands.set(name, runner);
			} else {
				throw { message: "Invalid command object registered: " + name };
			}
		}

		/**
   * Get a command class by name
   * @param  {string} name The name of the command
   * @return {Command}      The command class
   */

	}, {
		key: 'getCommand',
		value: function getCommand(name) {
			if (this.commands.has(name)) {
				return this.commands.get(name);
			}

			throw { message: "Command not found" + (name ? ": '" + name + "'" : "") };
		}

		/**
   * Register an event callback
   * @param  {string}   event    The name of the event
   * @param  {Function} callback The function to register
   * @return {number}            The index of the callback method
   */

	}, {
		key: 'on',
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
		key: 'cancel',
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
		key: 'emit',
		value: function emit(event) {
			var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var continuing = true;
			this.events.get(event).forEach(function (callback) {
				if (continuing && typeof callback == 'function') {
					continuing = !!callback(props);
				}
			});
		}

		/**
   * Reset all data when existing promises are fulfilled (SAFE)
   * @return {void}
   */

	}, {
		key: 'reset',
		value: function reset() {
			this.finally(this.resetNow, this.resetNow);
		}

		/**
   * Reset all data now, including existing promises (UNSAFE)
   * @return {[type]} [description]
   */

	}, {
		key: 'resetNow',
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
		key: 'run',
		value: function run(cmd, options) {
			try {
				var obj = this.getCommand(cmd);
				var command = new obj(options, this.config, this);
				if (command) {
					var execution = new _es6Promise2.default(command.run);
					this.promises.push(execution);
					return execution;
				}
				throw { message: "Invalid command requested: " + cmd };
			} catch (e) {
				console.log(e);
				console.error('Error! ', e.message ? e.message : e);
				if (e.stack) {
					console.log(e.stack);
				}
			}
		}

		/**
   * The conclusion of all registered promises
   * @param  {function} then 	The function to execute if all promises resolve
   * @param  {function} err  	The function to execute if one or more promises rejected
   * @return {Promise}		A promise containing all other promises
   */

	}, {
		key: 'finally',
		value: function _finally(then, err) {
			return _es6Promise2.default.all(this.promises).then(then).catch(err);
		}
	}]);

	return Application;
}();

exports.default = Application;