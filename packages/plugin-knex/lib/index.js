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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (Mason) {
    var cwd = process.cwd();
    Mason.registerCommand("migrate:up", _migrateUp2.default);
    Mason.registerCommand("migrate:down", _migrateDown2.default);
    Mason.registerCommand("migrate:reset", _migrateReset2.default);
    Mason.registerCommand("seed:run", _seedRun2.default);
};