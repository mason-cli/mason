"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class KnexUtil {
  constructor(knex) {
    this.knex = knex;
    this.dialect = this.knex.client.dialect;
  }

  dropTables(tables) {
    switch (this.dialect) {
      case "mysql":
        return this.knex.transaction(t => {
          this.knex.raw("SET FOREIGN_KEY_CHECKS=0").transacting(t).then(() => {
            return Promise.map(tables, name => {
              return this.knex.schema.dropTable(name).transacting(t);
            });
          }).then(t.commit).then(() => {
            return this.knex.raw("SET FOREIGN_KEY_CHECKS=1").transacting(t);
          });
        });
      case "postgresql":
        return this.knex.raw(`DROP TABLE IF EXISTS ${tables.join(",")} CASCADE`);
      case "sqlite3":
        return Promise.map(tables, name => {
          return this.knex.schema.dropTable(name);
        });
      default:
        return this._dialectError();
    }
  }

  deleteFromTables(tables) {
    return Promise.map(tables, name => {
      return this.knex.select().from(name).del();
    });
  }

  truncateTables(tables) {
    switch (this.dialect) {
      case "mysql":
        return this.knex.transaction(t => {
          this.knex.raw("SET FOREIGN_KEY_CHECKS=0").transacting(t).then(() => {
            return Promise.map(tables, function (name) {
              return this.knex(name).truncate().transacting(t);
            });
          }).then(function () {
            return this.knex.raw("SET FOREIGN_KEY_CHECKS=1").transacting(t);
          }).then(t.commit);
        });
      case "postgresql":
        let tableNames = tables.map(name => {
          return `"${name}"`;
        });
        return this.knex.raw(`TRUNCATE ${tableNames.join()} CASCADE`);
      case "sqlite3":
        return Promise.map(tables, name => {
          return this.knex(name).truncate();
        });
      default:
        return this._dialectError();
    }
  }

  allTableNames(exclude) {
    return this.knex.raw(this._tableNamesSql()).then(res => {
      return this._rows(res).map(table => {
        return table[Object.keys(table)[0]];
      }).filter(name => {
        return !exclude.includes(name);
      });
    });
  }

  _rows(res) {
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

  _dialectError() {
    throw new Error(`Unrecognized SQL dialect: ${this.dialect}`);
  }

  _tableNamesSql() {
    let databaseName = this.knex.client.databaseName || this.knex.client.connectionSettings.database;

    switch (this.dialect) {
      case "mysql":
        return `
          SELECT TABLE_NAME FROM information_schema.tables
          WHERE TABLE_SCHEMA = '${databaseName}'
          AND TABLE_TYPE = 'BASE TABLE'
        `;
      case "postgresql":
        return `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'`;
      case "sqlite3":
        return `SELECT name FROM sqlite_master WHERE type='table'`;
      default:
        return this._dialectError();
    }
  }
}
exports.default = KnexUtil;