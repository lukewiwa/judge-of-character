.PHONY: deploy
deploy:
	npm --prefix=frontend run generate && \
	npm --prefix=joc-infra run deploy