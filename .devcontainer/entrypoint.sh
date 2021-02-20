#!/bin/bash
set -e

npm --prefix=frontend install

exec "$@"
