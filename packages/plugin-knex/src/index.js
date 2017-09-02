import MigrateUpCommand from "./commands/migrate-up";
import MigrateDownCommand from "./commands/migrate-down";
import MigrateResetCommand from "./commands/migrate-reset";
import SeedRunCommand from "./commands/seed-run";
import MakeMigrationCommand from "./commands/make-migration";
import MakeSeedCommand from "./commands/make-seed";
import path from "path";

export default Mason => {
  let cwd = process.cwd();
  // Register scaffold templates
  Mason.emit("addScaffoldTemplate", {
    name: "migration",
    location: path.resolve(__dirname, "..", "templates/migration.js")
  });
  Mason.emit("addScaffoldTemplate", {
    name: "seed",
    location: path.resolve(__dirname, "..", "templates/seed.js")
  });

  // Register commands
  Mason.registerCommand("migrate:up", MigrateUpCommand);
  Mason.registerCommand("migrate:down", MigrateDownCommand);
  Mason.registerCommand("migrate:reset", MigrateResetCommand);
  Mason.registerCommand("seed:run", SeedRunCommand);
  Mason.registerCommand("make:migration", MakeMigrationCommand);
  Mason.registerCommand("make:seed", MakeSeedCommand);
};
