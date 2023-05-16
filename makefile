migrate-latest:
	yarn ts-node --project tsconfig.migrate.json src/server/db/migrator.ts

new-migration:
	cp src/utils/db/migrations/template.migration.ts src/utils/db/migrations/$(shell date -Is).migration.ts 