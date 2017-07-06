import Promise from "es6-promise";
import Command from "./Command";
import MethodCommand from "./MethodCommand";
import Prompt from "prompt-sync";
import child_process from "child_process";

const version = require("../../package.json").version;
const prompt = new Prompt();
const exec = util.promisify(child_process.exec);

import util from "util";

/**
 * Mason command line application class
 */
export default class Application {
	/**
	 * Build a new Mason application
	 * @param  {object} config The configuration object
	 * @return {void}
	 */
	constructor(config = {}) {
		this.config = config;
		this.commands = new Map();
		this.events = new Map();
		this.data = new Map();
	}

	/**
	 * Get the current Mason version
	 * @return {string} version descriptor
	 */
	version() {
		return version;
	}

	/**
	 * Compare Mason version to an external version
	 * @param  {string} a External version
	 * @return {int}   1 if external is higher, -1 if Mason is higher, 0 otherwise
	 */
	compareVersion(a) {
		let b = this.version();

		if (a === b) {
			return 0;
		}

		let a_parts = a.split(".");
		let b_parts = b.split(".");

		let len = Math.min(a_parts.length, b_parts.length);

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
	registerCommand(name, runner) {
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
	getCommand(name, gracefully) {
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
	on(event, callback) {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		let callbacks = this.events.get(event);
		let callbackIndex = callbacks.length;
		callbacks.push(callback);

		return callbackIndex;
	}

	/**
	 * Cancel a registered event callback
	 * @param  {string} event The name of the event
	 * @param  {number} index The index of the event callback
	 * @return {void}
	 */
	cancel(event, index) {
		if (this.events.has(event)) {
			let events = this.events.get(event);
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
	emit(event, props = {}) {
		let continuing = true;
		this.events.get(event).forEach(callback => {
			if (continuing && typeof callback == "function") {
				continuing = !!callback(props);
			}
		});
	}

	/**
	 * Reset all data when existing promises are fulfilled (SAFE)
	 * @return {void}
	 */
	reset() {
		this.finally(this.resetNow, this.resetNow);
	}

	/**
	 * Reset all data now, including existing promises (UNSAFE)
	 * @return {[type]} [description]
	 */
	resetNow() {
		delete this.commands;
		delete this.data;
		delete this.events;
		this.commands = new Map();
		this.events = new Map();
		this.data = new Map();
	}

	/**
	 * Run a command
	 * @param  {string} cmd     The command name
	 * @param  {object} options The command properties
	 * @return {mixed}			The command execution promise
	 */
	async run(cmd, options) {
		try {
			let obj = this.getCommand(cmd);
			let command = false;

			try {
				if (obj.prototype && obj.prototype.hasOwnProperty("run")) {
					command = new obj(this);
				} else {
					command = new MethodCommand(obj);
				}
			} catch (e) {
				console.info(e);
				throw "Invalid command object registered for " + cmd;
			}

			if (command) {
				return await command.run(options, this.config);
			}

			throw "Invalid command requested: " + cmd;
		} catch (e) {
			console.error("Error! ", e.message ? e.message : e);
			if (e.stack) {
				console.log(util.inspect(e.stack, false, null));
			}
		}
	}

	/**
	 * Prompt the user for input
	 * @param  {string} query The query to which the user will respond
	 * @return {string}       The user's response to the query
	 */
	prompt(query) {
		if (!process.stdin.setRawMode) {
			throw "Invalid prompt. If using Cygwin/Babun on Windows, try running with CMD.";
		}

		return prompt(query);
	}

	/**
	 * Spawn a new process
	 * @param  {string} command The command to execute
	 * @param  {array} args    arguments
	 * @param  {object} options options
	 * @return {mixed}         result of child_process.spawn
	 */
	spawn(command, args = undefined, options = undefined) {
		return child_process.spawn(command, args, options);
	}

	/**
	 * Fork a new module
	 * @param  {string} module  The module to fork
	 * @param  {array} args    arguments
	 * @param  {object} options options
	 * @return {mixed}         result of child_process.fork
	 */
	fork(module, args = undefined, options = undefined) {
		return child_process.fork(module, args, options);
	}

	/**
	 * Execute a command in a new prompt
	 * @param  {string} command The command to execute
	 * @param  {object} options options
	 * @param  {function} callback callback
	 * @return {mixed}         result of child_process.exec
	 */
	exec(command, options = undefined, callback = undefined) {
		return new Promise((resolve, reject) => {
			return child_process.exec(
				command,
				options,
				(err, stdout, stderr) => {
					if (err) {
						reject(err);
					} else {
						if (stdout) console.log(`${stdout}`);
						if (stderr) console.log(`${stderr}`);
						resolve();
					}
				}
			);
		});
	}

	/**
	 * A shortcut to retrieve child_process without requiring it elsewhere
	 * @return {mixed} child_process
	 */
	child_process() {
		return child_process;
	}

	/**
	 * Set the configuration options for Mason
	 * @param {object} config The configuration object
	 */
	setConfig(config) {
		this.config = config;
	}
}
