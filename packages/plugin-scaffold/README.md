# Mason Scaffold
Easily scaffold project templates via the command line

## Installation
To add scaffolding to your project, install the plugin:
`npm i -g mason.plugin.scaffold`

## Configuration
To register your custom templates, edit your project's Mason configuration using the following example:
```
module.exports = {
	scaffold: {
		templates: {
			'controller': './templates/controller.js',
			'model': './templates/model.js',
			'admin-panel': './templates/admin-panel.html'
		},
		definitions: {
			foo: 'ConfigForFoo'
		}
	}
};
```
### Definitions
As you can see in the configuration example above, you can also define "Definitions" that serve as default template bindings.
Any variable defined in the config will use the config value if none is provided for the template.

## Usage
Scaffold is used as follows:
`mason scaffold [template-name] [destination-filename] --foo=bar --baz=bang`
Where `[template-name]` is the registered name of the template you want to use, `[destination-filename]` is the full path to the new file you wish to create, `foo` is a template variable that will be replaced with `baz`, and so on.

## Template Syntax
By default, template replacements are prefixed with `@@{` and suffixed with `}@@`.
A template containing `function @@{foo}@@() {}` in the above usage example would result in a file containing `function bar() {}`

# Mason Plugin Support
Scaffold makes it easy to regiter additional templates from within a Mason plugin.
To do so, make use of the 'addScaffoldTemplate' event:
```
Mason.emit('addScaffoldTemplate', { name: 'my-template-name', location: __dirname + '/templates/my-template.js' });
```

## Building Mason Scaffold
To build this plugin, run the following from the project directory:
`npm run build`

## Contributions
Thanks to @jaimemasson for the idea and the name.
