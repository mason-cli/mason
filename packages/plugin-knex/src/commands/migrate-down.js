import { Command } from "@mason-cli/core";

export default class MigrateDownCommand extends Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Rollback most recently executed migrations`);
  }

  async run() {
    return await this.mason.exec(
      `${process.cwd()}/node_modules/.bin/knex migrate:rollback`
    );
  }
}
