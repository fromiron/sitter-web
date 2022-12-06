FROM postgres:15.1

RUN apt-get update && \
    apt-get clean language-pack-ja  && \
    rm -fr /var/lib/apt/lists/*

# Time Zone
ENV TZ Asia/Tokyo

# Language
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG="ja_JP.UTF-8" \
    LANGUAGE="ja_JP:ja" \
    LC_ALL="ja_JP.UTF-8"