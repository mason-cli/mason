#!/usr/bin/env node

'use strict'

const mason = require('../lib/index.js').default;

try {
	var input = new mason.Arguments();
	mason.Mason.run(input.command(), input.all());
} catch(e) {
	console.error('Error: ' + e.message);
	if(e.stack) {
		console.log(e.stack);
	}
}

mason.Mason.finally(() => {
	// console.log(' ');
}, () => {
	console.error('Error!');
});