.PHONY: deploy
deploy:
	npm --prefix=frontend run build && \
	npm --prefix=joc-infra run synth && \
	npm --prefix=joc-infra run deploy