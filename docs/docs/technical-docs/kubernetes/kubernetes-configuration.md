# ⚙️ Our Kubernetes Configuration

We have a separate private github repository with Kubernetes configuration files [here](https://github.com/GitMeshCE/kube-gitmesh). Please clone it, and inside, there are a couple of folders - the relevant ones are `staging` and `production`.

You have to position yourself inside one of these depending on which cluster you are connected to deploy to that cluster.

Within these folders, our Kubernetes configuration tells the Kubernetes cluster how to run our services.

For example - the configuration for our `api` service is as follows:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-dpl
spec:
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: gitmeshce/backend:1664283906.75de0e2
          command: ['npm']
          args: ['run', 'start:api']
          envFrom:
            - configMapRef:
                name: staging-backend-config
          env:
            - name: NODE_ENV
              value: staging
            - name: SERVICE
              value: api
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 8080
      targetPort: 8080
```

It is very similar to what we are doing with `docker-compose` locally but it has a few differences. In this file, two Kubernetes resources are being configured.

One is `Deployment` and the other is `Service`. To configure multiple resources in one file you have to use `---` before each one.

`Deployment` tells Kubernetes how it should start a `Pod` (and how many pods) - so you can see a docker image, command, args, and how environmental variables are configured.

One set of environmental variables is coming from our `ConfigMap` `staging-backend-config` and the other is services specific like `SERVICE`.

`Service` tells Kubernetes that these pods (with a label selector `app: api` will have port `8080` exposed to other Kubernetes pods inside the cluster through the same port `8080` (we could remap ports here if we wanted).

Our `api` service will have `api-svc` as a domain name inside the Kubernetes cluster. So, for example, if some other service within Kubernetes wants to call our `api` service, it should do so through `http://api-svc:8080` url.
