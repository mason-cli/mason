import { Command, Input } from "@mason-cli/core";

export default class MakeMigrationCommand extends Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Alias for "mason scaffold migration"`);
  }

  async run() {
    let argv = ["scaffold", "migration", "-i", "-f"];

    // Extract the extra input
    let i = 0;
    process.argv.forEach(arg => {
      if (i > 2) {
        argv.push(arg);
      }
      i++;
    });

    // Re-run the command
    const input = new Input(argv);
    return await this.mason.run(input.command(), input.all());
  }
}
