import MigrateUpCommand from "./commands/migrate-up";
import MigrateDownCommand from "./commands/migrate-down";
import MigrateResetCommand from "./commands/migrate-reset";
import SeedRunCommand from "./commands/seed-run";

export default Mason => {
    let cwd = process.cwd();
    Mason.registerCommand("migrate:up", MigrateUpCommand);
    Mason.registerCommand("migrate:down", MigrateDownCommand);
    Mason.registerCommand("migrate:reset", MigrateResetCommand);
    Mason.registerCommand("seed:run", SeedRunCommand);
};
