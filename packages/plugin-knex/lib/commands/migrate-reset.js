"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require("@mason-cli/core");

var _knexUtil = require("../knex-util");

var _knexUtil2 = _interopRequireDefault(_knexUtil);

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MigrateResetCommand extends _core.Command {
  static help() {
    console.log(`
            Reset your knex database.

            Options:
                --exclude           Exclude one or more tables from the reset
                --drop              Drop all tables not listed in --exclude
                --delete            Delete contents of all tables not listed in --exclude
                --knexPath=[path]   Supply the path of your knexfile (./knexfile by default)
        `);
  }

  async run(input, conf) {
    let config;
    if (input.options["knex-path"]) {
      config = require(_path2.default.resolve(input.options["knex-path"]));
    } else {
      config = require(_path2.default.resolve(`${process.cwd()}/knexfile.js`));
    }

    if (!config) {
      throw new Error(`Unable to locate knexfile!`);
    }

    let NODE_ENV = process.env.NODE_ENV || "development";
    let knex = (0, _knex2.default)(config[NODE_ENV] || config);
    let util = new _knexUtil2.default(knex);

    let exclude;
    if (input.options.exclude) {
      exclude = input.options.excludedTables.split(",");
    } else {
      exclude = [];
    }

    let tables = await util.allTableNames(exclude);
    let action = input.flags.includes("drop") ? "drop" : input.flags.includes("delete") ? "delete" : "truncate";

    console.log(`Preparing to ${action} tables...`);

    if (action === "drop") {
      await util.dropTables(tables);
    } else if (action === "delete") {
      await util.deleteFromTables(tables);
    } else {
      await util.truncateTables(tables);
    }

    console.log("Tables cleaned");
    return;
  }
}
exports.default = MigrateResetCommand;