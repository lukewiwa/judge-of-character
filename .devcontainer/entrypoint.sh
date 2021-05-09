#!/bin/bash
set -e

sudo chown -h node:root /var/run/docker.sock

npm --prefix=frontend install
npm --prefix=joc-infra install

exec "$@"
