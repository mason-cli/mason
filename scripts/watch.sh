babel packages/core/src/ -d packages/core/lib/ --watch &
babel packages/plugin-knex/src/ -d packages/plugin-knex/lib/ --watch &
babel packages/plugin-scaffold/src/ -d packages/plugin-scaffold/lib/ --watch &

wait

echo "Done"