# bash build.sh
# kubectl rollout restart deployment web -n demo

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
# Generate Javascript file that adds environment variables to window._env_ when loaded by index.html, then start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/assets/env.sh && nginx -g \"daemon off;\""]

# docker run -d -p 80:80 paulgilchrist/mongodb-web
# docker rm -f <containerID>
