# Worker walkthrough

In addition to common features available to all services, a worker has access to:

* the PostgreSQL database;
* the OpenSearch instance;
* a Temporal worker for running Temporal workflows and activities, within a specific namespace and for a given task queue.

Unlike a consumer, a worker is in charge of long running, unpredictable, and deterministic tasks.

### Environment variables

Required environment variables for a worker, in addition to the ones mentioned in [.](./ "mention"):

* `gitmesh_TEMPORAL_SERVER_URL`: Temporal server URL to connect to.
* `gitmesh_TEMPORAL_NAMESPACE`: Temporal namespace for which the worker will execute workflows and activities.
* `gitmesh_TEMPORAL_TASKQUEUE`: Temporal task queue for which the worker will execute workflows and activities.
* `gitmesh_TEMPORAL_ENCRYPTION_KEY_ID`: Unique identifier (name) of the encryption key to use.
* `gitmesh_TEMPORAL_ENCRYPTION_KEY`: 32 length encryption key use to encode/decode data between Temporal server, workers, and clients.

Required environment variables if PostgreSQL is enabled:

* `gitmesh_DB_READ_HOST`: PostgreSQL reader instance URL to connect to.
* `gitmesh_DB_WRITE_HOST`: PostgreSQL writer instance URL to connect to.
* `gitmesh_DB_PORT`: PostgreSQL port of the host to connect to.
* `gitmesh_DB_USERNAME`: PostgreSQL user to use to connect.
* `gitmesh_DB_PASSWORD`: PostgreSQL password to use to connect.
* `gitmesh_DB_DATABASE`: PostgreSQL database to connect to.

Required environment variables if OpenSearch is enabled:

* `gitmesh_OPENSEARCH_NODE`: URL of the OpenSearch node to connect to.
* `gitmesh_OPENSEARCH_AWS_REGION`: AWS Region of the OpenSearch instance.
* `gitmesh_OPENSEARCH_AWS_ACCESS_KEY_ID`: AWS Access Key ID to use to connect to OpenSearch.
* `gitmesh_OPENSEARCH_AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key to use to connect to OpenSearch.

### Example

In `./services/apps/<service>/src/main.ts`:

```javascript
import { Config } from '@gitmesh/standard'
import { ServiceWorker, Options } from '@gitmesh/worker'

const config: Config = {
  producer: {
    enabled: false,
  },
  temporal: {
    enabled: false,
  },
  redis: {
    enabled: false,
  },
}

const options: Options = {
  postgres: {
    enabled: true,
  },
  opensearch: {
    enabled: false,
  },
}

const svc = new ServiceWorker(config, options)

setImmediate(async () => {
  await svc.init()
  await svc.start()
})

```

The worker archetype automatically imports and bundles all workflows exported in `workflow.ts` and all activities exported in `activities.ts`.

All Temporal workflows must be exported in `./services/apps/<service>/src/workflows.ts`, like this:

```javascript
import { example } from './workflows/greet'

export { example }
```

All Temporal activities must be exported in `./services/apps/<service>/src/activities.ts`, like this:

```javascript
import { greet } from './activities/greet'

export { greet }
```
