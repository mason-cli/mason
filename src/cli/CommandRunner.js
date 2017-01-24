import Promise from 'es6-promise'
import Command from './Command'

export default class CommandRunner {
	constructor() {
		this.commands = new Map();
		this.promises = [];
	}

	registerCommand(name, runner) {
		if(runner.prototype instanceof Command) {
			this.commands.set(name, runner);
		} else {
			throw {message:"Invalid command object registered: " + name};
		}
	}

	getCommand(name) {
		if(this.commands.has(name)) {
			return this.commands.get(name);
		}

		throw {message:"No command found for " + name};
	}

	run(cmd, options) {
		let obj = this.getCommand(cmd);
		let command = new obj(options);
		if(command) {
			let execution = new Promise(command.run);
			this.promises.push(execution);
			return execution;
		}
		return false;
	}

	finally(then, err) {
		return Promise.all(this.promises).then(then).catch(err);
	}
}