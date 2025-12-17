---
description: How to connect to our Kubernetes clusters.
---

# Connecting to the cluster

### Required software

* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - command line tool to access AWS
  * [Guide on authenticating CLI tool with AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/) - command line tool to access Kubernetes cluster (hosting agnostic - works with any Kubernetes cluster - does not matter if it’s on AWS/Digital Ocean/Google cloud…)

### Getting access to our Kubernetes cluster

1. First, you must ensure that your AWS IAM user is in a relevant group that can access our Kubernetes clusters (contact Joan if you need access).
   * `gitmesh-kube-staging-admins` for staging
   * `gitmesh-kube-production-admins` for production.

```bash
# A user with admin access has to add you to the group
aws iam add-user-to-group --group-name <relevant-group-name> --user-name <IAM user name>
# This can also be done on the AWS Web console in the IAM user groups section
```

2. After that, you can generate a `kubectl` configuration for accessing our cluster (`$HOME/.kube/config` file) by executing this command
   1. `gitmesh-kube-staging` is our staging Kubernetes cluster name and it requires a role arn `arn:aws:iam::359905442998:role/gitmesh-kube-staging-admin` and region eu-central-1
   2. `gitmesh-kube-production` is our production Kubernetes cluster name and it requires a role arn `arn:aws:iam::359905442998:role/gitmesh-kube-production-admin` and region eu-central-1

```bash
[aws eks update-kubeconfig --name <cluster-name> --region <region> --role-arn arn:aws:iam::359905442998:role/<iam-role-name>](https://www.notion.so/c33bcb8a931a4f169c543847aab96beb?pvs=21)
```

Now you should be able to access the Kubernetes cluster. To make sure it worked, try running `kubectl get pods`. The result should be something like this:

```bash
NAME                                         READY   STATUS    RESTARTS      AGE
api-dpl-7c9fc75cf-mz7zn                      1/1     Running   0             20h
frontend-dpl-76c9cd8c6f-n8tg7                1/1     Running   0             133m
job-generator-dpl-64df888968-z4klr           1/1     Running   0             20h
nodejs-worker-dpl-69f74d946d-52nlm           1/1     Running   0             20h
nodejs-worker-dpl-69f74d946d-qfkpd           1/1     Running   0             20h
nodejs-worker-dpl-69f74d946d-rz47l           1/1     Running   0             20h
nodejs-worker-dpl-69f74d946d-swm47           1/1     Running   0             20h
nodejs-worker-dpl-69f74d946d-vbn5d           1/1     Running   0             20h
premium-api-dpl-679757c5c6-gmt82             1/1     Running   0             23h
premium-job-generator-dpl-556dcf4678-ld9k5   1/1     Running   0             23h
premium-python-worker-dpl-745bff7498-g78tj   1/1     Running   0             23h
python-worker-dpl-7f9f796786-zw4fv           1/1     Running   0             23h
```

### Accessing the Kubernetes dashboard

1. To access the Kubernetes dashboard, you can execute [`access-dashboard.sh`](http://access-dashboard.sh/) in the staging or production folders in the `gitmesh-kube` repository:
   * Copy the token value (for staging Kubernetes, this token does not expire - for production, it expires after one day)
2. Paste the token to get past the Authentication screen, and you should get the overview of our cluster via the [Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) service.

Inside the Kubernetes dashboard, you can do a lot of things (all can also be done directly with `kubectl` !):

* See individual Pod logs.
* Get shell access inside each separate Pod.
* Delete a pod (if a Deployment manages it, it will cause a restart - a Kubernetes Deployment manages all our services)
* You can see Pod configuration (environment variables that are passed to the individual pod)
* You can see how much RAM/CPU an individual pod uses or how much an individual node has left/is using so you know when you need to add a couple more nodes to the Kubernetes cluster.
