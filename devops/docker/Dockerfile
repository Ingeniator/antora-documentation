ARG node="node:latest"
ARG nginx="nginx:stable" 

FROM ${node} AS build
ENV CI=true
ENV CHARTS=true
ENV DOCSEARCH_ENABLED=true
ENV DOCSEARCH_ENGINE=lunr
ENV DOCSEARCH_LANGS=ru,fr


ARG kroki=false 
#install kroki server
COPY devops/kroki/kroki-server-v0.15.1.jar .
RUN if ["$kroki" == "true"] ; then \
    add-apt-repository ppa:webupd8team/java; apt-get update; apt-get -y install default-jre; \
    java -DKROKI_SAFE_MODE=unsafe -jar kroki-server-v0.15.1.jar &\
    fi

WORKDIR /app
COPY . .
RUN npm i -g @antora/cli@2.3 @antora/site-generator-default@2.3 lunr-languages antora-site-generator-lunr antora-lunr; 
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
