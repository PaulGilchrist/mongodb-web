# mongodb-web
Front-end for saga-api which is part of the larger kubernetes-example project.  This website is meant to run inside a container requiring it to pull its environment settings from the container rather than the typical Angular method of compiling in `environments.ts` at build time.

## Steps to use the container's environment at startup vs build

Angular has the concept that it is built specific to a single environment.  When building an Angular project, you pass the environment name and it is used to select which `environment.ts` file to build into the final output scripts. 

Containers (Docker/Kubernetes) has the concept of build once and deploy to any environment, but that does not work with out of the box Angular so some minor changes are needed as described below.

This project adds 3 new files and updates 2 others in very minor ways to support getting the environment variables from the container.  Those changes are summarized as follows:

* `assets/env-defaults.txt` - default environment variables used for development if none are supplied on container startup.    This file should be edited to include all needed environment variables (one per line).

```js
API_URL=https://api.local.com/contacts
```

* `assets/env.sh` - bash script to read env-defaults.txt and create a new 'env-config.js' file overwriting it with actual environment variables if supplied at container startup

```bash
#!/bin/bash
cd "$(dirname "$0")" # Set directory to the directory containing this script

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment 
echo "window._env_ = {" >> ./env-config.js

# Read each line in env-defaults.txt file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> ./env-config.js
done < ./env-defaults.txt

echo "}" >> ./env-config.js
```

* `assets/env-config.js` - loaded with index.html and adds environment variables to window._env_. This file need not be edited as it is re-created on each start-up.

```js
window._env_ = {
    API_URL: "https://api.local.com/contacts"
}
```

* `index.html` - loads and executes 'env-config.js' when the application starts.  Below is only part of 'index.html' and should be added to the top of the 'body' section.

```html
<script src="./assets/env-config.js"></script>
```

* `Dockerfile` - adds bash, makes 'env.sh' executable, and executes it before starting nginx web server.  Below is only the part of `Dockerfile` related to environment variables and not the full file.

```bash
# Add bash
RUN apk add --no-cache bash
# Make our shell script executable
RUN chmod +x /usr/share/nginx/html/assets/env.sh
# Generate Javascript file that adds environment variables to window._env_ when loaded by index.html, then start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/assets/env.sh && nginx -g \"daemon off;\""]
```

Based on the `Dockerfile`, when the container starts, it will first execute `env.sh` which builds a new `env-config.js` file using the environment variables listed in `env-defaults.txt` and overriding them if a matching environment variable exists.

`index.html`, will load and execute `env-config.js` which loads those environment variables into `window._env_` so that they can be globally referenced anywhere within the Angular application.