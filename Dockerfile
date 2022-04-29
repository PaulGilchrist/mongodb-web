# ng build --prod
# docker build --rm -f "Dockerfile" --no-cache --platform linux/arm64/v8 -t paulgilchrist/mongodb-web:arm64v8 .
# docker push paulgilchrist/mongodb-web:arm64v8
# docker build --rm -f "Dockerfile" --no-cache --platform linux/amd64 -t paulgilchrist/mongodb-web:amd64 .
# docker push paulgilchrist/mongodb-web:amd64
# docker manifest create paulgilchrist/mongodb-web:latest --amend paulgilchrist/mongodb-web:arm64v8 --amend paulgilchrist/mongodb-web:amd64
# docker manifest push paulgilchrist/mongodb-web:latest
FROM nginx:alpine
LABEL author="Paul Gilchrist"
COPY ./dist/mongodb-web /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
# docker run -d -p 80:80 paulgilchrist/mongodb-web
# docker rm -f <containerID>
