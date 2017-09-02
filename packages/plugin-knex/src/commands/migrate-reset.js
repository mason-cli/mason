import { Command } from "mason.cli";
import KnexUtil from "../knex-util";
import Knex from "knex";
import path from "path";

export default class MigrateResetCommand extends Command {
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
            config = require(path.resolve(input.options["knex-path"]));
        } else {
            config = require(path.resolve(`${process.cwd()}/knexfile.js`));
        }

        if (!config) {
            throw new Error(`Unable to locate knexfile!`);
        }

        let NODE_ENV = process.env.NODE_ENV || "development";
        let knex = Knex(config[NODE_ENV] || config);
        let util = new KnexUtil(knex);

        let exclude;
        if (input.options.exclude) {
            exclude = input.options.excludedTables.split(",");
        } else {
            exclude = [];
        }

        let tables = await util.allTableNames(exclude);
        let action = input.flags.includes("drop")
            ? "drop"
            : input.flags.includes("delete") ? "delete" : "truncate";

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
