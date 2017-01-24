'use strict'

import Mason from './index'
import Arguments from './cli/Arguments'

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