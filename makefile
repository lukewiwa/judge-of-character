

docker-dev-up:
	docker-compose \
		--file=devops/dev/docker-compose.yaml \
		up \
		--build

docker-dev-down:
	docker-compose \
		--file=devops/dev/docker-compose.yaml \
		down

docker-dev-clean:
	docker container rm --force judge-django-dev judge-node-dev judge-postgres \
	docker volume rm judge-db-data judge-npm-cache judge-pypoetry-cache


.PHONY: codegen
codegen:
	docker-compose \
		--file=devops/dev/docker-compose.yaml \
		run --rm judge-django-dev bash -c "\
			poetry run python manage.py generateschema --format=openapi-json > api/schema.json" && \
	docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli \
		generate \
			--input-spec /local/backend/api/schema.json \
			--generator-name typescript-fetch \
			--additional-properties=useSingleRequestParameter=true,typescriptThreePlus=true,withInterfaces=true \
			--output /local/frontend/assets/.codegen/