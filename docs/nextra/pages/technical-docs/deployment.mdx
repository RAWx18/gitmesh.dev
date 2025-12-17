---
description: A guide on how to deploy services to both production and staging.
---

# 🚀 Deployment

## Deploy to staging

To deploy to staging, merge to the `staging-main` branch and push the code. The deployment will go through automatically! You can see the [GitHub staging deployment actions to check](https://github.com/GitMeshCE/gitmesh.ce/actions/workflows/staging-deploy-backend.yaml) the status. You will also get a notification in the `deploys-staging` Slack channel once it has gone through.

* Run migrations if needed.
* Update the environment variables if needed.

## Deploy to production

The production deployment is done with a [GitHub action](https://github.com/GitMeshCE/gitmesh.ce/actions/workflows/production-deploy.yaml). You can select which services you want to deploy and the branch (it should 99% of the time be `main`), and click Deploy!

* Run migrations if needed.
* Update the environment variables if needed.

## Updating environment variables

Environment variables are kept in the [kube repo](https://github.com/GitMeshCE/kube-gitmesh). There is a folder for production and one for staging. There we have environment variables for frontend and backend.

To push an update to the Kubernetes cluster:

1. Make sure you have an up-to-date version of the Kube repo
2. Make the changes you want, and commit and push them! Otherwise, they could be overwritten by a colleague.
3. Run the `[production/staging]./update-config-map` script to update the values in the cluster.
4. Re-deploy the necessary services.

## Running migrations

Running database migrations is, for now, not a part of the automated deployment. They need to be run manually. To run migrations:

1. Make sure you are in the appropriate branch. If you are running them on production, this is `main`. For staging, `staging-main`. Make sure the branch is up-to-date.
2. Export the directory where GitMesh CE is in your system. For example `export gitmesh_CHECKOUT_DIR=/Users/joanreyero/Documents/GitMesh CE`.
3. Run the script `./migrate-up.sh` to run the migrations.
