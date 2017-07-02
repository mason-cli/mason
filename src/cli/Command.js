/**
 * Mason command class
 */
export default class Command {
  constructor(input, conf, runner) {
    if (typeof this.run !== "function") {
      throw "Invalid command. Command must have a run method.";
    }
    this.input = input;
    this.conf = conf;
    this.runner = runner;
    this.run = this.run.bind(this);
  }

  static help() {
    console.log("No help text provided for this command");
  }
}
