#!/usr/bin/env node

'use strict'

var fs = require('fs');

var CommandRunner = require('../lib/cli/CommandRunner').default;
var Arguments = require('../lib/cli/Arguments').default;
var builtins = require('../lib/cli/Builtins').default;

var configPath = process.cwd() + '/mason.config.js';
var config = false;
if(fs.existsSync(configPath)) {
	config = require(configPath);
} else {
	console.info('Unable to locate configuration file at "' + configPath + '"');
}

var Mason = new CommandRunner(config);
builtins(Mason);

// Load plugins
if(config.plugins) {
	config.plugins.forEach((location) => {
		if(location.substring(0, 2) == './') {
			location = process.cwd() + '/' + location.substring(2);
		}

		let plugin = require(location);
		if(plugin) {
			plugin.default(Mason);
		}
	});
}

try {
	var input = new Arguments();
	Mason.run(input.command(), input.all(), config);
} catch(e) {
	console.error('Error: ' + e.message);
	if(e.stack) {
		console.log(e.stack);
	}
}

Mason.finally(() => {
	// console.log(' ');
}, () => {
	console.error('Error!');
});