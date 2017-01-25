export default class Command {
  constructor(input, conf, runner) {
    if(typeof(this.run) !== 'function') {
      throw "Invalid command. Command must have a run method.";
    }
	this.run = this.run.bind(this);
    this.input = input;
    this.conf = conf;
    this.runner = runner;
  }
}