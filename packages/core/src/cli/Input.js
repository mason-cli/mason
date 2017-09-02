/**
 * Mason command line input abstraction layer
 */
export default class Input {
  /**
	 * Build the input object and extract command line arguments
	 * @param  {Number} skip The number of parameters to skip
	 * @return {void}
	 */
  constructor(input, skip = 0) {
    this._command = "";
    this._bin = false;
    this._file = false;
    this._args = [];
    this._flags = [];
    this._options = {};

    if (typeof input === "string") {
      input = input.split(" ");
    }

    // Tokenize input
    input.forEach((val, index, array) => {
      if (index >= skip) {
        let first_two = val.substr(0, 2);
        if (first_two == "--" || val.substr(0, 1) == "-") {
          let arg =
            first_two == "--"
              ? val.substr(2, val.length - 2)
              : val.substr(1, val.length - 1);
          if (arg.indexOf("=") !== -1) {
            let parts = arg.split("=");
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
    if (a.indexOf("node") != -1) {
      n = true;
      this._bin = a;
      a = this._args.shift();
    }
    if (n) {
      this._file = a;
      a = this._args.shift();
    } else if (a.indexOf("mason") == 0) {
      this._bin = a;
      a = this._args.shift();
    }
    this._command = a;
  }

  /**
	 * Get all arguments
	 * @return {object} The arguments
	 */
  arguments() {
    return this._args;
  }

  /**
	 * Get the command name
	 * @return {string} Command name
	 */
  command() {
    return this._command;
  }

  /**
	 * Get all flags
	 * @return {object} Flags as an array
	 */
  flags() {
    return this._flags;
  }

  /**
	 * Get all keyval options
	 * @return {object} Keyval options object
	 */
  options() {
    return this._options;
  }

  /**
	 * Get all input
	 * @return {object} All input
	 */
  all() {
    return { args: this._args, flags: this._flags, options: this._options };
  }
}
