---
description: >-
  How to sync GitHub and Linear tickets, open and tag pull requests, and update
  issues.
---

# 🤺 How we work on tickets

Tickets will be picked from Linear. When you pick up a ticket, ensure you are assigned and keep the status current. Linear will be the source of truth for project owners, customer support, and all your teammates, so we must be disciplined to keep tickets updated.

This is the lifecycle of a ticket with all its possible statuses:

* **Backlog**: the ticket is not planned yet.
* **Todo**: it's planned but not started.
* **In progress**: it's actively being worked on.
* **In review**: in code review and/or in staging.
* **Done**: Merged and deployed to production.

### Branches naming and convention

When creating a branch, we always use one of the following prefixes:

* `feature/`: when it is a new feature or a big improvement. These will usually be the biggest pull requests.
* `improvement/`: a reasonably small enhancement for an existing feature.
* `bugfix/`: when the pull request is fixing a bug.
* `documentation/`: for branches that will only update docs.

### Deploying to staging

We should deploy to staging for all tickets that are not an emergency to ensure they will work in the production environment.

To deploy to staging, merge to the `staging-main` branch and push the code. The deployment will go through automatically! You can see the [GitHub staging deployment actions to check](https://github.com/GitMeshCE/gitmesh.ce/actions/workflows/staging-deploy-backend.yaml) the status. You will also get a notification in the `deploys-staging` Slack channel once it has gone through.

* If migrations need to be run, check the section for running migrations.
* If environment variables need to be updated, check the section for updating environment variables.

### Opening pull requests

When opening a pull request, there are two conventions we need to follow:&#x20;

* Always add a human-readable name that will give enough context to whoever reads it. Every Tuesday, Joan will go through all of the pull requests to add them to the changelog, and having meaningful names will make the job smoother.
* Assign a label to the pull request. It should be one of _Bug_, _Improvement_, _Feature_, or _Documentation_. We have a release drafter that will collect all the pull requests of the week and come up with version numbers and sectioning automatically based on these labels.

GitHub copilot will write a detailed description for the pull request, so you don't need to worry about it. However, if it's front-end changes, screenshots are appreciated!

### Deploying to production

Once the task has been finalized, it's time to merge and deploy! Deploying to production is simple: it's done with the [production deploy GitHub action](https://github.com/GitMeshCE/gitmesh.ce/actions/workflows/production-deploy.yaml).&#x20;

Always deploy to production as soon as the ticket is ready, unless there is a very good reason not to. We aim to ship new things to our users quickly and continuously.

