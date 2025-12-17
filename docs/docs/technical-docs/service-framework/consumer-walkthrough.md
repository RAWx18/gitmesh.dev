# Consumer walkthrough

In addition to common features available to all services, a consumer has access to:

* a Kafka consumer client, allowing to consume messages or bathes of messages.

Only low latency and high success rate tasks should run within in a consumer. Otherwise, executing a workflow in a worker or sending a signal to a worker should most likely be a better approach. In general, a consumer should not do unpredictable tasks. Each use case if of course different and must be treated individually before making any decisions.

### Environment variables

Required environment variables for a consumer, in addition to the ones mentioned in [.](./ "mention"):

* `gitmesh_KAFKA_TOPICS`: Comma-separated list of Kafka topics to consume messages from. We shall most of the time have only one topic to consume from.
* `gitmesh_KAFKA_GROUP_ID`: The Kafka group ID the consumer belongs to.

### Example

In `./services/apps/<service>/src/main.ts`:

<pre class="language-javascript"><code class="lang-javascript">import { Config } from '@gitmesh/standard'
import { ServiceConsumer, Options } from '@gitmesh/consumer'

const config: Config = {
  producer: {
    enabled: false,
  },
  temporal: {
    enabled: true,
  },
  redis: {
    enabled: false,
  },
}

const options: Options = {
  maxWaitTimeInMs: 1000,
  retryPolicy: {
    initialRetryTime: 250,
    maxRetryTime: 2000,
    retries: 15,
  },
}

const svc = new ServiceConsumer(config, options)

setImmediate(async () => {
  await svc.init()

  await svc.consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      // ...
    },
  })

<strong>  await svc.start()
</strong>})

</code></pre>
