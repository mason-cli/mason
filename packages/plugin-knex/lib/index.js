"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _migrateUp = require("./commands/migrate-up");

var _migrateUp2 = _interopRequireDefault(_migrateUp);

var _migrateDown = require("./commands/migrate-down");

var _migrateDown2 = _interopRequireDefault(_migrateDown);

var _migrateReset = require("./commands/migrate-reset");

var _migrateReset2 = _interopRequireDefault(_migrateReset);

var _seedRun = require("./commands/seed-run");

var _seedRun2 = _interopRequireDefault(_seedRun);

var _makeMigration = require("./commands/make-migration");

var _makeMigration2 = _interopRequireDefault(_makeMigration);

var _makeSeed = require("./commands/make-seed");

var _makeSeed2 = _interopRequireDefault(_makeSeed);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Mason => {
  let cwd = process.cwd();
  // Register scaffold templates
  Mason.emit("addScaffoldTemplate", {
    name: "migration",
    location: _path2.default.resolve(__dirname, "..", "templates/migration.js")
  });
  Mason.emit("addScaffoldTemplate", {
    name: "seed",
    location: _path2.default.resolve(__dirname, "..", "templates/seed.js")
  });

  // Register commands
  Mason.registerCommand("migrate:up", _migrateUp2.default);
  Mason.registerCommand("migrate:down", _migrateDown2.default);
  Mason.registerCommand("migrate:reset", _migrateReset2.default);
  Mason.registerCommand("seed:run", _seedRun2.default);
  Mason.registerCommand("make:migration", _makeMigration2.default);
  Mason.registerCommand("make:seed", _makeSeed2.default);
};