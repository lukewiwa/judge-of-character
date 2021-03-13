# Note: You can use any Debian/Ubuntu based image you want.
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:14


SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sSL https://get.docker.com | sh -

# install hadolint
ARG HADOLINT_VERSION="v1.19.0"
RUN curl -sSL "https://github.com/hadolint/hadolint/releases/download/${HADOLINT_VERSION}/hadolint-Linux-x86_64" --output /usr/bin/hadolint \
  && chmod +x /usr/bin/hadolint

# install shellcheck
ARG SC_VERSION="stable"
RUN curl -sSL "https://github.com/koalaman/shellcheck/releases/download/${SC_VERSION}/shellcheck-${SC_VERSION}.linux.x86_64.tar.xz" | tar -xJv \
  && cp "shellcheck-${SC_VERSION}/shellcheck" /usr/bin/

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
