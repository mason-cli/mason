"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KnexUtil = function () {
  function KnexUtil(knex) {
    _classCallCheck(this, KnexUtil);

    this.knex = knex;
    this.dialect = this.knex.client.dialect;
  }

  _createClass(KnexUtil, [{
    key: "dropTables",
    value: function dropTables(tables) {
      var _this = this;

      switch (this.dialect) {
        case "mysql":
          return this.knex.transaction(function (t) {
            _this.knex.raw("SET FOREIGN_KEY_CHECKS=0").transacting(t).then(function () {
              return Promise.map(tables, function (name) {
                return _this.knex.schema.dropTable(name).transacting(t);
              });
            }).then(t.commit).then(function () {
              return _this.knex.raw("SET FOREIGN_KEY_CHECKS=1").transacting(t);
            });
          });
        case "postgresql":
          return this.knex.raw("DROP TABLE IF EXISTS " + tables.join(",") + " CASCADE");
        case "sqlite3":
          return Promise.map(tables, function (name) {
            return _this.knex.schema.dropTable(name);
          });
        default:
          return this._dialectError();
      }
    }
  }, {
    key: "deleteFromTables",
    value: function deleteFromTables(tables) {
      var _this2 = this;

      return Promise.map(tables, function (name) {
        return _this2.knex.select().from(name).del();
      });
    }
  }, {
    key: "truncateTables",
    value: function truncateTables(tables) {
      var _this3 = this;

      switch (this.dialect) {
        case "mysql":
          return this.knex.transaction(function (t) {
            _this3.knex.raw("SET FOREIGN_KEY_CHECKS=0").transacting(t).then(function () {
              return Promise.map(tables, function (name) {
                return this.knex(name).truncate().transacting(t);
              });
            }).then(function () {
              return this.knex.raw("SET FOREIGN_KEY_CHECKS=1").transacting(t);
            }).then(t.commit);
          });
        case "postgresql":
          var tableNames = tables.map(function (name) {
            return "\"" + name + "\"";
          });
          return this.knex.raw("TRUNCATE " + tableNames.join() + " CASCADE");
        case "sqlite3":
          return Promise.map(tables, function (name) {
            return _this3.knex(name).truncate();
          });
        default:
          return this._dialectError();
      }
    }
  }, {
    key: "allTableNames",
    value: function allTableNames(exclude) {
      var _this4 = this;

      return this.knex.raw(this._tableNamesSql()).then(function (res) {
        return _this4._rows(res).map(function (table) {
          return table[Object.keys(table)[0]];
        }).filter(function (name) {
          return !exclude.includes(name);
        });
      });
    }
  }, {
    key: "_rows",
    value: function _rows(res) {
      switch (this.dialect) {
        case "mysql":
          return res[0];
        case "postgresql":
          return res.rows;
        case "sqlite3":
          return res;
        default:
          return this._dialectError();
      }
    }
  }, {
    key: "_dialectError",
    value: function _dialectError() {
      throw new Error("Unrecognized SQL dialect: " + this.dialect);
    }
  }, {
    key: "_tableNamesSql",
    value: function _tableNamesSql() {
      var databaseName = this.knex.client.databaseName || this.knex.client.connectionSettings.database;

      switch (this.dialect) {
        case "mysql":
          return "\n          SELECT TABLE_NAME FROM information_schema.tables\n          WHERE TABLE_SCHEMA = '" + databaseName + "'\n          AND TABLE_TYPE = 'BASE TABLE'\n        ";
        case "postgresql":
          return "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'";
        case "sqlite3":
          return "SELECT name FROM sqlite_master WHERE type='table'";
        default:
          return this._dialectError();
      }
    }
  }]);

  return KnexUtil;
}();

exports.default = KnexUtil;