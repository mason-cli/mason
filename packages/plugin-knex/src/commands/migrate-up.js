import { Command } from "@mason-cli/core";

export default class MigrateUpCommand extends Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Run all pending migrations`);
  }

  async run() {
    return await this.mason.exec(
      `${process.cwd()}/node_modules/.bin/knex migrate:latest`
    );
  }
}
