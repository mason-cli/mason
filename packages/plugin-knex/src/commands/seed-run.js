import { Command } from "@mason-cli/core";

export default class SeedRunCommand extends Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Execute Knex seeds`);
  }

  async run() {
    return await this.mason.exec(
      `${process.cwd()}/node_modules/.bin/knex seed:run`
    );
  }
}
