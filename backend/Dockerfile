FROM python:3.10-alpine3.16
LABEL maintainer="github.com/fromiron"

ENV PYTHONUNBUFFERED 1

COPY ./ /backend
WORKDIR /backend
EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r ./requirements.txt && \
    rm -rf /temp && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="/py/bin$PATH"

USER django-user