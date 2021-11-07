FROM node:latest AS build

WORKDIR /app

COPY . .

RUN npm i -g @antora/cli@2.3 @antora/site-generator-default@2.3; \
    antora antora-playbook.yml


FROM nginx:stable

LABEL project="docs"
LABEL version="0.0.1"
LABEL description="Documentation"

COPY devops/nginx/nginx.conf /etc/nginx/
COPY devops/nginx/mime.types /etc/nginx/
COPY devops/nginx/assets/ /www/data/assets/

COPY --from=build /app/build/site /www/data

EXPOSE 8080

ENTRYPOINT ["nginx"]
