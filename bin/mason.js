#!/usr/bin/env node

'use strict'

require('app-module-path').addPath(process.cwd() + '/node_modules');

const fs = require('fs');
const util = require('util');
const path = require('path');

const Application = require('../lib/cli/Application').default;
const Input = require('../lib/cli/Input').default;
const builtins = require('../lib/cli/Builtins').default;

var Mason = new Application();
builtins(Mason);

const configPath = process.cwd() + '/mason.config.js';
var config = false;
if(fs.existsSync(configPath)) {
	config = require(configPath);
	if(typeof(config) == 'function') {
		config = config(Mason);
	}
	Mason.setConfig(config);
} else {
	console.info('WARNING: `mason.config.js` not found');
	console.log('');
}

// Load plugins
if(config.plugins) {
	config.plugins.forEach((location) => {
		if(location.substring(0, 2) == './' || location.substring(0, 2) == '.\\') {
			location = process.cwd() + path.delimiter + location.substring(2);
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