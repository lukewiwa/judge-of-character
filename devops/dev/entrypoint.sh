#!/bin/bash
set -e

poetry install

/wait

poetry run python manage.py migrate --noinput
poetry run python manage.py collectstatic --noinput

exec "$@"