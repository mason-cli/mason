"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mason = require("mason.cli");

var _knexUtil = require("../knex-util");

var _knexUtil2 = _interopRequireDefault(_knexUtil);

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MigrateResetCommand = function (_Command) {
    _inherits(MigrateResetCommand, _Command);

    function MigrateResetCommand() {
        _classCallCheck(this, MigrateResetCommand);

        return _possibleConstructorReturn(this, (MigrateResetCommand.__proto__ || Object.getPrototypeOf(MigrateResetCommand)).apply(this, arguments));
    }

    _createClass(MigrateResetCommand, [{
        key: "run",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input, conf) {
                var config, NODE_ENV, knex, util, exclude, tables, action;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                config = void 0;

                                if (input.options["knex-path"]) {
                                    config = require(_path2.default.resolve(input.options["knex-path"]));
                                } else {
                                    config = require(_path2.default.resolve(process.cwd() + "/knexfile.js"));
                                }

                                if (config) {
                                    _context.next = 4;
                                    break;
                                }

                                throw new Error("Unable to locate knexfile!");

                            case 4:
                                NODE_ENV = process.env.NODE_ENV || "development";
                                knex = (0, _knex2.default)(config[NODE_ENV] || config);
                                util = new _knexUtil2.default(knex);
                                exclude = void 0;

                                if (input.options.exclude) {
                                    exclude = input.options.excludedTables.split(",");
                                } else {
                                    exclude = [];
                                }

                                _context.next = 11;
                                return util.allTableNames(exclude);

                            case 11:
                                tables = _context.sent;
                                action = input.flags.includes("drop") ? "drop" : input.flags.includes("delete") ? "delete" : "truncate";


                                console.log("Preparing to " + action + " tables...");

                                if (!(action === "drop")) {
                                    _context.next = 19;
                                    break;
                                }

                                _context.next = 17;
                                return util.dropTables(tables);

                            case 17:
                                _context.next = 26;
                                break;

                            case 19:
                                if (!(action === "delete")) {
                                    _context.next = 24;
                                    break;
                                }

                                _context.next = 22;
                                return util.deleteFromTables(tables);

                            case 22:
                                _context.next = 26;
                                break;

                            case 24:
                                _context.next = 26;
                                return util.truncateTables(tables);

                            case 26:

                                console.log("Tables cleaned");
                                return _context.abrupt("return");

                            case 28:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function run(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return run;
        }()
    }], [{
        key: "help",
        value: function help() {
            console.log("\n            Reset your knex database.\n\n            Options:\n                --exclude           Exclude one or more tables from the reset\n                --drop              Drop all tables not listed in --exclude\n                --delete            Delete contents of all tables not listed in --exclude\n                --knexPath=[path]   Supply the path of your knexfile (./knexfile by default)\n        ");
        }
    }]);

    return MigrateResetCommand;
}(_mason.Command);

exports.default = MigrateResetCommand;