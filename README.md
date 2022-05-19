# mongodb-web
Front-end for saga-api which is part of the larger kubernetes-example project.  This website is meant to run inside a container requiring it to pull its environment settings from the container rather than the typical Angular method of compiling in `environments.ts` at build time.

## Steps to use the container's environment at startup vs build

This project has the following 4 files that work together to support the browser getting its environment variables based on the web server vs built into the Angular at compile time.

* `assets/env-config.js` - loaded with index.html and adds environment variables to window._env_
* `assets/env-defaults.txt` - default environment variables used for development and if none are supplied on container startup
* `assets/env.sh` - bash script to read env-defaults.txt and write env-config.js overwriting with actual environment variables if supplied at container startup
* `Dockerfile` - adds bash, makes env.sh executable, and executes it before starting nginx web server

Based on the `Dockerfile`, when the container starts, it will first execute `env.sh` which builds a new `env-config.js` file using the environment variables listed in `env-defaults.txt` and overriding them if a matching environment variable exists.

`index.html`, will load and execute `env-config.js` which loads those environment variables into `window._env_` so that they can be globally referenced anywhere within the Angular application.