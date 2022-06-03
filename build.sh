#!/bin/sh
echo "$(tput setaf 2)"
echo "Building paulgilchrist/mongodb-web:arm64v8"
echo "$(tput setaf 7)"
docker build --rm -f "Dockerfile" --no-cache --platform linux/arm64v8 -t paulgilchrist/mongodb-web:arm64v8 .
echo "$(tput setaf 2)"
echo "Pushing paulgilchrist/mongodb-web:arm64v8 to https://hub.docker.com"
echo "$(tput setaf 7)"
docker push paulgilchrist/mongodb-web:arm64v8
echo "$(tput setaf 2)"
echo "Building paulgilchrist/mongodb-web:amd64"
echo "$(tput setaf 7)"
docker build --rm -f "Dockerfile" --no-cache --platform linux/amd64 -t paulgilchrist/mongodb-web:amd64 .
echo "$(tput setaf 2)"
echo "Pushing paulgilchrist/mongodb-web:amd64 to https://hub.docker.com"
echo "$(tput setaf 7)"
docker push paulgilchrist/mongodb-web:amd64
echo "$(tput setaf 2)"
echo "Removing paulgilchrist/mongodb-web:latest manifest"
echo "$(tput setaf 7)"
docker manifest rm paulgilchrist/mongodb-web:latest
echo "$(tput setaf 2)"
echo "Creating paulgilchrist/mongodb-web:latest manifest"
echo "$(tput setaf 7)"
docker manifest create paulgilchrist/mongodb-web:latest paulgilchrist/mongodb-web:arm64v8 paulgilchrist/mongodb-web:amd64
echo "$(tput setaf 2)"
echo "Pushing paulgilchrist/mongodb-web:latest manifest to https://hub.docker.com"
echo "$(tput setaf 7)"
docker manifest push paulgilchrist/mongodb-web:latest
echo "$(tput setaf 2)"
echo "Build complete"
echo "Don't forget to update Kubernetes. For example:"
echo "$(tput setaf 3)"
echo "    kubectl rollout restart deployment web -n demo"
echo "$(tput setaf 7)"
