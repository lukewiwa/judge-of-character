

docker-dev-up:
	docker-compose \
		--file=devops/dev/docker-compose.yaml \
		up \
		--build

docker-dev-down:
	docker-compose \
		--file=devops/dev/docker-compose.yaml \
		down