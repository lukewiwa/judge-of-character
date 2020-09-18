

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