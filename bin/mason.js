#!/usr/bin/env node

'use strict'

var Mason = require('../lib/index');
var Arguments = require('../lib/cli/Arguments');

try {
	var input = new Arguments();
	Mason.run(input.command(), input.all());
} catch(e) {
	console.error('Error: ' + e.message);
	console.log(e.stack);
}

Mason.finally(() => {
	console.log(' ');
});