# About Mason
Mason is a modular command line toolkit written in ES6 with promises.

## Installation
For command line usage, install Mason globally:
`npm i -g mason.cli`

## Configuration
You can load additional plugins with Mason by creating a `mason.config.js` file in your project directory.

### Example Configuration:
```
module.exports = function(Mason) { 
	Mason.registerCommand('test', function(input, config, Mason, resolve, reject) {
		console.log('Test!');
		resolve();
	});

	return {
  		plugins: ['mason.plugin.scaffold', './path/to/LocalPlugin']
	};
};
```
In this example, mason.plugin.scaffold is a package installed from NPM and './path/to/LocalPlugin' is the path of a local js module.

## Usage
By default, Mason currently comes with only two commands: `version` and `help`.
As we learned above, Mason does support plugins. Plugins can extend Mason and introduce additional commands.

# Authoring a Plugin
An example of plugin support can be found in [the mason-scaffold repository](https://github.com/aewing/mason-scaffold)

## Building Mason
To build Mason, run the following:
`npm run build`

## Example Local Application
To build the Mason example application, run the following:
`npm run build-example`

To run the application, from the example directory, run the following:
`../bin/mason.js test`

Or, with Mason installed globally:
`mason test`