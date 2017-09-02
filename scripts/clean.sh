rm -rf packages/core/lib/ &
rm -rf packages/core/node_modules/ &
rm -rf packages/plugin-knex/lib/ &
rm -rf packages/plugin-knex/node_modules/ &
rm -rf packages/plugin-scaffold/lib/ &
rm -rf packages/plugin-scaffold/node_modules/ &

wait

echo "Done"