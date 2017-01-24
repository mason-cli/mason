export default class Arguments {
	constructor(skip=0) {
		this._command = 'help';
		this._bin = false;
		this._file = false;
		this._args = [];
		this._flags = [];
		this._options = {};

		// Tokenize input
		process.argv.forEach((val, index, array) => {
			if(index >= skip) {
				if(val.substr(0, 2) == '--') {
					let arg = val.substr(2, val.length - 2);
					if(arg.indexOf('=') !== -1) {
						let parts = arg.split('=');
						this._options[parts[0]] = parts[1];
					} else {
						this._flags.push(arg);
					}
				} else {
					this._args.push(val);
				}
			}
		});

		let a = this._args.shift();
		let n = false;
		if(a.indexOf('node') != -1) {
			n = true;
			this._bin = a;
			a = this._args.shift();
		}
		if(n) {
			this._file = a;
			a = this._args.shift();
		} else if(a.indexOf('mason') == 0) {
			this._bin = a;
			a = this._args.shift();
		}
		this._command = a;
	}

	arguments() {
		return this._args;
	}

	command() {
		return this._command;
	}

	flags() {
		return this._flags;
	}

	options() {
		return this._options;
	}

	all() {
		return { args: this._args, flags: this._flags, options: this._options };
	}
}