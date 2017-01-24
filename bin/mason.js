#!/usr/bin/env node

'use strict'

const Mason = require('../lib/index.js').default;
const Arguments = require('../lib/cli/Arguments').default;

try {
	var input = new Arguments();
	Mason.run(input.command(), input.all());
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