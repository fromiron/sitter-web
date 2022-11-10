FROM python:3.10-alpine3.16
LABEL maintainer="github.com/fromiron"

ENV PYTHONUNBUFFERED 1

COPY ./ /backend
WORKDIR /backend
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
    pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-build-deps \
        build-base postgresql-dev musl-dev && \
    pip install -r ./requirements.txt && \
    if [ $DEV = "true" ]; \
        then pip install -r ./requirements.dev.txt ; \
    fi && \
    rm -rf /temp && \
    apk del .tmp-build-deps && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="$PATH"

USER django-user