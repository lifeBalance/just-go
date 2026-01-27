DB_CONNECTION = host=localhost port=5439 user=urlshortener password=supersecret dbname=urlshortener sslmode=disable

.PHONY: migration-create
migration-create:
	@read -p "Enter migration name: " name; \
	goose -dir migrations create $$name sql

.PHONY: migrate-up
migrate-up:
	goose -dir migrations postgres "$(DB_CONNECTION)" up

.PHONY: migrate-down
migrate-down:
	goose -dir migrations postgres "$(DB_CONNECTION)" down

.PHONY: migrate-status
migrate-status:
	goose -dir migrations postgres "$(DB_CONNECTION)" status

.PHONY: migrate-reset
migrate-reset:
	goose -dir migrations postgres "$(DB_CONNECTION)" reset