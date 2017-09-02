"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require("@mason-cli/core");

class SeedRunCommand extends _core.Command {
  constructor(Mason) {
    super();
    this.mason = Mason;
  }

  static help() {
    console.log(`Execute Knex seeds`);
  }

  async run() {
    return await this.mason.exec(`${process.cwd()}/node_modules/.bin/knex seed:run`);
  }
}
exports.default = SeedRunCommand;