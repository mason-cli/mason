# mason-plugin-knex
Mason CLI support for managing Knex installations

## Commands
* migrate:up
    - Runs all pending migrations
* migrate:down
    - Rolls back most recent migrations
* migrate:reset
    - Truncates or deletes all data, or optionally drops all tables
    - Options:
        + --exclude=table_a,table_b

        `Provide a list of tables to exclude from the reset`

        + --delete

        `Delete table contents instead of truncating`

        + --drop

        `Drop tables instead of deleting or truncating`