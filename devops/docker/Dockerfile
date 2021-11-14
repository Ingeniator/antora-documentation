ARG node="node:latest"
ARG nginx="nginx:stable" 


FROM ${node} AS build
ENV CI=true

WORKDIR /app
COPY . .
RUN npm i -g @antora/cli@2.3 @antora/site-generator-default@2.3 antora-site-generator-lunr antora-lunr; 
RUN npm i lorem-ipsum asciidoctor-chart asciidoctor-kroki lunr-languages;
RUN antora antora-playbook.yml --generator antora-site-generator-lunr --attribute page-pagination= --stacktrace;

FROM ${nginx}
ENV DOCSEARCH_ENABLED=true
ENV DOCSEARCH_ENGINE=lunr
ENV DOCSEARCH_LANG=ru


LABEL project="example-docs"
LABEL version="0.0.1"
LABEL description="Documentation"

COPY devops/nginx/nginx.conf /etc/nginx/
COPY devops/nginx/mime.types /etc/nginx/
COPY devops/nginx/assets/ /www/data/assets/
COPY --from=build /app/build/site /www/data

EXPOSE 8080

ENTRYPOINT ["nginx"]
