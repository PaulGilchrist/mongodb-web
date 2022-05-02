# docker build --rm -f "Dockerfile" --no-cache --platform linux/arm64/v8 -t paulgilchrist/mongodb-web:arm64v8 .
# docker push paulgilchrist/mongodb-web:arm64v8
# docker build --rm -f "Dockerfile" --no-cache --platform linux/amd64 -t paulgilchrist/mongodb-web:amd64 .
# docker push paulgilchrist/mongodb-web:amd64
# docker manifest rm paulgilchrist/mongodb-web:latest
# docker manifest create paulgilchrist/mongodb-web:latest paulgilchrist/mongodb-web:arm64v8 paulgilchrist/mongodb-web:amd64
# docker manifest push paulgilchrist/mongodb-web:latest

#stage 1
FROM node:16 as app-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
LABEL author="Paul Gilchrist"
COPY --from=app-build /app/dist/mongodb-web /usr/share/nginx/html
# Replace nginx's default server configuration to redirect 404 to homepage (Lets Angular handle routing)
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
# Add bash
RUN apk add --no-cache bash
# Make our shell script executable
RUN chmod +x /usr/share/nginx/html/assets/env.sh
# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/assets/env.sh && nginx -g \"daemon off;\""]

# docker run -d -p 80:80 paulgilchrist/mongodb-web
# docker rm -f <containerID>
