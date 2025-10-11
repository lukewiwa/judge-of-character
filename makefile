.PHONY: deploy
deploy:
	npm --prefix=src run build && \
	npm --prefix=infra run cdk -- deploy --all