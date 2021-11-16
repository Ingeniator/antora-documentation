ARG node="node:latest"
ARG nginx="nginx:stable" 

FROM ${node} AS build
WORKDIR /app
ENV CI=true
ENV CHARTS=true
ENV DOCSEARCH_ENABLED=true
ENV DOCSEARCH_ENGINE=lunr
ENV DOCSEARCH_LANGS=ru,fr

RUN npm i -g @antora/cli@2.3 @antora/site-generator-default@2.3 lunr-languages antora-site-generator-lunr antora-lunr; 

ARG kroki=false 
#install kroki server
COPY devops/kroki/kroki-server-v0.15.1.jar .
RUN if ["$kroki" == "true"] ; then \
    add-apt-repository ppa:webupd8team/java; apt-get update; apt-get -y install default-jre; \
    java -DKROKI_SAFE_MODE=unsafe -jar kroki-server-v0.15.1.jar &\
    fi

ARG PUPPETEER=true
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable libxshmfence-dev fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \ 
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

COPY . .
RUN npm i lorem-ipsum asciidoctor-chart asciidoctor-kroki;
RUN DOCSEARCH_ENABLED=true DOCSEARCH_ENGINE=lunr DOCSEARCH_LANGS=ru,fr antora antora-playbook.yml --generator antora-site-generator-lunr --attribute page-pagination= --stacktrace;

FROM ${nginx}

LABEL project="example-docs"
LABEL version="0.0.1"
LABEL description="Documentation"

COPY devops/nginx/nginx.conf /etc/nginx/
COPY devops/nginx/mime.types /etc/nginx/
COPY devops/nginx/assets/ /www/data/assets/
COPY --from=build /app/build/site /www/data

EXPOSE 8080

ENTRYPOINT ["nginx"]
