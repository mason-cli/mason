import Promise from 'es6-promise'
import Command from './Command'
import MethodCommand from './MethodCommand'

import util from 'util'

/**
 * Mason command line application class
 */
export default class Application {
	/**
	 * Build a new Mason application
	 * @param  {object} config The configuration object
	 * @return {void}
	 */
	constructor(config={}) {
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
	static get version() {
		return '0.1.1';
	}

	/**
	 * Compare Mason version to an external version
	 * @param  {string} a External version
	 * @return {int}   1 if external is higher, -1 if Mason is higher, 0 otherwise
	 */
	compareVersion(a) {
		let b = this.version;

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
		if(typeof(runner) == 'function') {
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
		if(this.commands.has(name)) {
			return this.commands.get(name);
		}

		if(gracefully) {
			return false;
		} else {
			throw "Command not found" + (name ? (": '" + name + "'") : "");
		}
	}

	/**
	 * Register an event callback
	 * @param  {string}   event    The name of the event
	 * @param  {Function} callback The function to register
	 * @return {number}            The index of the callback method
	 */
	on(event, callback) {
		if(!this.events.has(event)) {
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
		if(this.events.has(event)) {
			let events = this.events.get(event);
			if(events[index]) {
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
	emit(event, props={}) {
		let continuing = true;
		this.events.get(event).forEach((callback) => {
			if(continuing && typeof callback == 'function') {
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
	run(cmd, options) {
		try {
			let obj = this.getCommand(cmd);
			let command = false;

			try {
				if(obj.prototype && obj.prototype.hasOwnProperty('run')) {
					command = new obj(options, this.config, this);
				} else {
					command = new MethodCommand(obj, options, this.config, this);
				}
			} catch(e) {
				console.info(e);
				throw "Invalid command object registered for " + cmd;
			}

			if(command) {
				let execution = new Promise(command.run);
				this.promises.push(execution);
				return execution;
			}
			throw "Invalid command requested: " + cmd;
		} catch(e) {
			console.error('Error! ', e.message ? e.message : e);
			if(e.stack) {
				console.log(util.inspect(e.stack, false, null));
			}
		}
	}

	/**
	 * Set the configuration options for Mason
	 * @param {object} config The configuration object
	 */
	setConfig(config) {
		this.config = config;
	}

	/**
	 * The conclusion of all registered promises
	 * @param  {function} then 	The function to execute if all promises resolve
	 * @param  {function} err  	The function to execute if one or more promises rejected
	 * @return {Promise}		A promise containing all other promises
	 */
	finally(then, err) {
		return Promise.all(this.promises).then(then).catch(err);
	}
}