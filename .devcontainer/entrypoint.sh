#!/bin/bash
set -e

npm --prefix=frontend install
npm --prefix=joc-infra install

exec "$@"
