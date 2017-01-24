#!/usr/bin/env babel-node

'use strict'

import Mason from '../lib/index'
import Arguments from '../lib/cli/Arguments'

try {
	let input = new Arguments();
	Mason.run(input.command(), input.all());
} catch(e) {
	console.error('Error: ' + e.message);
	console.log(e.stack);
}

Mason.finally(() => {
	console.log(' ');
});