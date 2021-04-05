#!/bin/bash

npm --prefix=frontend install
npm --prefix=joc-infra install
npm --prefix=backend install

exec "$@"
