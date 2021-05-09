
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:14


SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sSL https://get.docker.com | sh - && \
  touch /var/run/docker.sock && \
  usermod -aG docker node

# install hadolint
ARG HADOLINT_VERSION="v2.1.0"
RUN curl -sSL "https://github.com/hadolint/hadolint/releases/download/${HADOLINT_VERSION}/hadolint-Linux-x86_64" --output /usr/bin/hadolint \
  && chmod +x /usr/bin/hadolint

# install shellcheck
ARG SC_VERSION="stable"
RUN curl -sSL "https://github.com/koalaman/shellcheck/releases/download/${SC_VERSION}/shellcheck-${SC_VERSION}.linux.x86_64.tar.xz" | tar -xJv \
  && cp "shellcheck-${SC_VERSION}/shellcheck" /usr/bin/


ARG PROJECT_DIR
RUN mkdir -p \
  ${PROJECT_DIR}/frontend/node_modules/ \
  ${PROJECT_DIR}/backend/node_modules/ \
  ${PROJECT_DIR}/joc-infra/node_modules/ \
  /home/node/.vscode-server/extensions \
  && chown -R node \
  ${PROJECT_DIR} \
  /home/node/.vscode-server

USER node
