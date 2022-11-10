FROM python:3.10-alpine3.16
LABEL maintainer="github.com/fromiron"

ENV PYTHONUNBUFFERED 1

COPY ./ /backend
WORKDIR /backend
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
    pip install --upgrade pip && \
    pip install -r ./requirements.txt && \
    if [ $DEV = "true" ]; \
        then pip install -r ./requirements.dev.txt ; \
    fi && \
    rm -rf /temp && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="$PATH"

USER django-user