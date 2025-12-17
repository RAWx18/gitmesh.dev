---
description: Documentation on how to run GitMesh CE's services locally.
---

# 👨💻 Local Development

We have a CLI tool that abstracts the logic of running `[GitMesh CE](http://GitMesh CE)`'s local infrastructure. It can:

* start the whole development environment,
* restart each service individually,
* clear your local database data
* start services with hot reloading for development.

## Scaffold

We have some dependency services that we need to run before we start our services. Things like the database, Cube.js, Reddit... These are called `scaffold` services within this script.

To manipulate `scaffold` services, you can use these `CLI` commands:

```bash
# start scaffold services if they did not start already
./cli scaffold up

# Stop scaffold services if they are started
./cli scaffold down

# stops our services, stops scaffold services, and destroys all the data (database, for example)
./cli scaffold destroy

# same as running cli scaffold destroy and cli scaffold up
./cli scaffold reset
```

For example, imagine starting a new branch and wanting a clean environment. You can run `cli scaffold reset`, and it will re-start `scaffold` with a clean database.

The `docker-compose` configuration for `scaffold` services are in `scripts/scaffold.yaml` file.

## Services

On the other hand, the services we are developing (like `api`, `nodejs-worker`...) are called services. These can be run individually, and they usually work standalone.

To manipulate services, you can use these `CLI` commands:

```bash
# start a service if it's not started already
./cli service api up

# stop a service if it's started
./cli service api down

# restart a service
./cli service api restart

# get service logs
./cli service api logs
```

For example, if you want to start the frontend and API without workers, you could start the `api` and `frontend` services only.

### Hot reloading

For some services, we have a hot reload enabled with volume mapping directly to our source folders. These services are currently just the ones with Typescript/Javascript and NodeJS. Python ones don’t have this capability.

To start a service in this hot reload dev mode, you should start it up like this:

```bash
DEV=1 ./cli service api restart
```

And it will start with volume maps.

### Configuration

The configuration for these services is in the `scripts/services` folder - each service has its YAML file, and within that YAML file, it has two services configured - one regular and one that will be started when `DEV=1` is used.

### Starting all services

There are four shortcuts to start things up all at once:

* `cli start` will start scaffold and all the services at once
* `cli start-dev` will start the scaffold and all services with `DEV=1` all at once
* `cli clean-start` will do a cleanup & start scaffold and all the services at once
* `cli clean-start-dev` will do a cleanup & start the scaffold and all services with `DEV=1` all at once

### Saving resources

To save resources on your machine, especially if you are running on Mac, we recommend starting only the needed services and only using hot-reloading when needed.

Imagine you are working on the frontend. You need the API to get data, but you do not need to make any changes there. To save resources, we recommend starting up the API without volume-binding and the frontend with the following:

```bash
./cli scaffold up
./cli service api up
DEV=1 ./cli service frontend up
```

## Local Environment Configuration

### For backend services

There are two types of environment files: those that are committed and hold the default configuration (marked by `.env.dist.`), and those that should never be committed because they hold secrets (marked by `.env.override.`).

We also have configured the environment so services can work with and without Docker. Docker-specific files are suffixed with a `.composed`.

This is a description of the four environment files:

* `backend/.env.dist.local`
  * The default configuration for services when running on your host machine outside of Docker.
  * It does not contain secrets, just plain system configuration like the connection to the local database.
  * It is committed to the public repository.
* `backend/.env.dist.composed`
  * The default configuration for services when running on a Docker environment.
  * It is used in combination with `backend/.env.dist.local`:
    * When starting services with the CLI (which uses Docker), they get the environment variables from `backend/.env.dist.local` first, and then also from this file.
    * Therefore, you don’t have to provide all the configurations in this file, just the ones you want to override for Docker.
    * For example, the database host  `backend/.env.dist.local` is set to `[localhost](http://localhost)`. In `backend/.env.dist.composed` it is set to `db`, which is a DNS name of the service visible to other Docker containers inside our Docker network.
    * It is also committed to the public git repository.
* `backend/.env.override.local`
  * This file contains the secrets that should not be committed to the public repository, such as integration secrets, API keys...
  * It is meant to override the configuration of the `.env.dist.local` environment with secrets.
  * It is created automatically when `scripts/cli` it is started if it’s not present.
  * It is not committed to the public git repository.
* `backend/.env.override.composed`
  * This file contains the secrets that should not be committed to the public repository when running the services with Docker.
  * It overrides the configuration for services running in Docker (with `CLI` script). Like the previous `.composed` file, it will get the values  `.env.override.local` by default.
  * It is created automatically when `scripts/cli` it is started if it’s not present.
  * It is not committed to the public git repository.

The order of exported env files when running with the CLI script is:

* `backend/.env.dist.local`
* `backend/.env.dist.composed`
* `backend/.env.override.local`
* `backend/.env.override.composed`

### For frontend services

For the frontend it works the same way. The only difference is the environment files are in the `frontend` directory.

### Example scenarios and how to use .env files:

If you want to start services with our `CLI` and configure the GitHub integration:

* You configure `backend/.env.override.local` and `backend/.env.override.composed` with GitHub secrets
* You start the services with `scripts/cli` like you would normally do

If you want to start service on your host machine for debugging purposes:

* Configure `backend/.env.override.local` with the relevant secrets
* Export `backend/.env.dist.local` and `backend/.env.override.local`, in that order.
* Start the service you want to debug, for example `npm run start:api:local`.
