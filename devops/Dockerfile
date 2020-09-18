ARG PYTHON_TAG=3.8.5
FROM python:${PYTHON_TAG}

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

# Non-root user variables
ARG USERNAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID

ENV HOME_DIR=/home/user
ENV APP_DIR=${HOME_DIR}/app

# Create non-root user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --shell /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Download poetry
ADD https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py ${HOME_DIR}/get-poetry.py
RUN chown ${USER_UID}:${USER_GID} ${HOME_DIR}/get-poetry.py

USER ${USER_UID}:${USER_GID}

# Install poetry
RUN python ${HOME_DIR}/get-poetry.py && rm ${HOME_DIR}/get-poetry.py
ENV PATH="${HOME_DIR}/.poetry/bin:$PATH"


RUN mkdir ${APP_DIR} \
    ${APP_DIR}/backend \
    ${APP_DIR}/dist \
    ${APP_DIR}/bundle\
    ${HOME_DIR}/.cache \
    ${HOME_DIR}/.cache/pypoetry

WORKDIR ${APP_DIR}