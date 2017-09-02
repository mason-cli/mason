"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require("@mason-cli/core");

class MigrateDownCommand extends _core.Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Rollback most recently executed migrations`);
  }

  async run() {
    return await this.mason.exec(`${process.cwd()}/node_modules/.bin/knex migrate:rollback`);
  }
}
exports.default = MigrateDownCommand;