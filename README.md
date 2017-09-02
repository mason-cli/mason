# About Mason
Mason is a modular command line toolkit written in ES6 with promises.

## Installation
For command line usage, install Mason globally:
```
npm i -g @mason-cli/bin
```

## Configuration
You can load additional plugins with Mason by creating a `mason.config.js` file in your project directory.

### Example Configuration:
`mason.config.js`

```js
module.exports = function(Mason) {
	Mason.registerCommand('test', function(input, config, Mason, resolve, reject) {
		Mason.spawn(`${__dirname}/node_modules/.bin/jest`);
	});

	return {
		plugins: ['mason.plugin.scaffold', './path/to/LocalPlugin']
	};
};
```

## Now with support for Babel!
`mason.babel.js`

```js
export default (Mason) => {
    Mason.registerCommand('test', (input, config, Mason, resolve, reject) => {
			Mason.spawn(`${__dirname}/node_modules/.bin/jest`);
    });
};
```

In this example, mason.plugin.scaffold is a package installed from NPM and './path/to/LocalPlugin' is the path of a local js module.

## Usage
By default, Mason currently comes with only two commands: `version` and `help`.
As we learned above, Mason does support plugins. Plugins can extend Mason and introduce additional commands.

# Authoring a Plugin
An example of plugin support can be found in the packages directory of [the mason repository](https://github.com/mason-cli/mason)

## Building Mason
To build Mason and the related plugins, run the following:
```
make clean
make build
```

## Example Local Application
To build the Mason example application, run the following:
`npm run build-example`

To run the application, from the example directory, run the following:
`../bin/mason.js test`

Or, with Mason installed globally:
`mason test`