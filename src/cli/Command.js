export default class Command {
  constructor(conf) {
    if(typeof(this.run) !== 'function') {
      throw "Invalid command. Command must have a run method.";
    }
	this.run = this.run.bind(this);
    this.conf = conf;
  }
}