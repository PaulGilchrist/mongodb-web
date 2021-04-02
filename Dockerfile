# ng build --prod
# docker build --rm -f "Dockerfile" -t paulgilchrist/mongodb-web:latest .
# docker push paulgilchrist/mongodb-web
FROM nginx:alpine
LABEL author="Paul Gilchrist"
COPY ./dist/mongodb-web /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
# docker run -d -p 80:80 paulgilchrist/mongodb-web
# docker rm -f <containerID>
