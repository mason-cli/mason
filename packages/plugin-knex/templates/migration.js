const table_name = "@@{table_name}@@";
export async function up(knex) {
  await knex.schema.createTable(table_name, table => {
    table.increments("id");
  });
}

export async function down(knex) {
  await knex.schema.dropTable(table_name);
}
