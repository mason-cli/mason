babel packages/core/src/ -d packages/core/lib/ &
babel packages/plugin-knex/src/ -d packages/plugin-knex/lib/ &
babel packages/plugin-scaffold/src/ -d packages/plugin-scaffold/lib/ &

wait

echo "Done"