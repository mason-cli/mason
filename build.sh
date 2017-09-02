cd packages/core && babel src/ -d lib/ &
cd packages/plugin-knex && babel src/ -d lib/ &
cd packages/plugin-scaffold && babel src/ -d lib/ &

wait

echo "Done"