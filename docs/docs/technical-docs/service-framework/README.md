---
description: >-
  The service framework holds the foundations for building and managing back-end
  services at GitMesh CE.
---

# 🦍 Service framework

Providing a common layer — a.k.a. service framework — for our back-end services allows us to define ground rules, improve consistency and reliability, and therefore improve developer experience and productivity.

### Common features

A service is built on top of one and only one service archetype. These service archetypes all inherit from a `standard` one, which brings:

* Tracer and logger, for end-to-end observability.
* Registered integrations.
* Feature flags via Unleash, if applicable.
* Kafka producer (optional), if the service needs to produce messages.
* Temporal client (optional), if the service needs to execute or signal workflows, or even retrieve some information from Temporal.
* Redis client and utils (optional), if the service needs key-value or mutex mechanisms.

### Service archetypes

Available service archetypes a service can be built on top of:

* `consumer`: A consumer service consume messages from Kafka topic(s), for a specific group ID. Only low latency and high success rate tasks shall run within in a consumer. Otherwise, executing a workflow in a worker or sending a signal to a worker is most likely a better approach. See [consumer-walkthrough.md](consumer-walkthrough.md "mention") for details.
* `worker`: A worker service is in charge of running Temporal workflows and activities, for a given namespace and task queue. Unlike a consumer, a worker is in charge of long running, unpredictable, and deterministic tasks. See [worker-walkthrough.md](worker-walkthrough.md "mention") for details.
* `rest` (coming soon)

### Environment variables

You will find below available environment variables common to all services. Select the service archetype you wish to learn more about to see archetype-specific environment variables.

Required environment variables:

* `SERVICE`: Represents the service name.

Optional environment variables:

* `gitmesh_UNLEASH_URL`: HTTP URL to connect to for Unleash.
* `gitmesh_UNLEASH_API_TOKEN`: API token to use for Unleash.

Required environment variables if Kafka producer is enabled:

* `gitmesh_KAFKA_BROKERS`: Comma-separated list of Kafka broker URLs to connect to.

Required environment variables if Temporal client is enabled:

* `gitmesh_TEMPORAL_SERVER_URL`: Temporal server URL to connect to.
* `gitmesh_TEMPORAL_NAMESPACE`: Default Temporal namespace to use when using the client.
* `gitmesh_TEMPORAL_ENCRYPTION_KEY_ID`: Unique identifier (name) of the encryption key to use.
* `gitmesh_TEMPORAL_ENCRYPTION_KEY`: 32 length encryption key use to encode/decode data between Temporal server, workers, and clients.

Required environment variables if Redis is enabled:

* `gitmesh_REDIS_HOST`: Redis server URL to connect to.
* `gitmesh_REDIS_PORT`: Redis port of the host to connect to.
* `gitmesh_REDIS_USERNAME`: Redis user to use to connect.
* `gitmesh_REDIS_PASSWORD`: Redis password to use to connect.
