#!/usr/bin/env node

'use strict'

const fs = require('fs');
const util = require('util');

const Application = require('../lib/cli/Application').default;
const Input = require('../lib/cli/Input').default;
const builtins = require('../lib/cli/Builtins').default;

const configPath = process.cwd() + '/mason.config.js';

var config = false;
if(fs.existsSync(configPath)) {
	config = require(configPath);
} else {
	console.info('WARNING: `mason.config.js` not found');
	console.log('');
}

var Mason = new Application(config);
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
	var input = new Input();
	Mason.run(input.command(), input.all(), config);
} catch(e) {
	console.error('Error!', e.message ? e.message : e);
	if(e.stack) {
		console.log(util.inspect(e.stack, false, null));
	}
}

Mason.finally(() => {
	// console.log(' ');
}, (err) => {
	console.error('Error!', util.inspect(err, false, null));
});